package handler

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/google/uuid"
	"github.com/mileusna/useragent"
)

func T(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now()
	ctx := context.Background()
	storer := pkg.NewStorer()
	storer.Renew()

	g := getGValue(r)
	if g == "" {
		// If g is not specifid, we have no way of fetching the campaign,
		// so redirect to the catch-all url
		fmt.Println("g not specified")
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	campaign, err := storer.GetCampaignByPublicId(ctx, g)
	if err != nil {
		// If campaign not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Campaign by public ID: " + err.Error())
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	flow, err := storer.GetFlowById(ctx, campaign.FlowID)
	if err != nil {
		// If flow not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Flow: " + err.Error())
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	publicClickId := uuid.New().String()

	var (
		ipInfoData     pkg.IPInfoData
		receivedIpInfo = false
	)

	// Fetch IP Info
	ipInfoToken := os.Getenv("IP_INFO_TOKEN")
	if ipInfoToken != "" && pkg.RulesNeedIpInfo(flow.RuleRoutes) {
		data, err := pkg.FetchIpInfo(r.RemoteAddr, ipInfoToken)
		if err != nil {
			fmt.Println("error fetching IP Info: " + err.Error())
		} else {
			ipInfoData = data
			receivedIpInfo = true
		}
	}

	userAgentStr := r.UserAgent()
	ua := useragent.Parse(userAgentStr)

	// Determine where we are redirecting the visitor
	var dest Destination
	if flow.Type == db.FlowTypeURL && *flow.URL != "" {
		dest = Destination{
			Type: DestTypeURL,
			URL:  *flow.URL,
		}
	} else if flow.Type == db.FlowTypeBuiltIn || flow.Type == db.FlowTypeSaved {
		opts := DetermineDestOptions{
			ctx:        ctx,
			storer:     *storer,
			campaign:   campaign,
			flow:       flow,
			r:          r,
			userAgent:  ua,
			ipInfoData: ipInfoData,
		}
		determinedDest, err := determineDest(opts)
		if err != nil {
			dest = makeCatchAllDest()
		} else {
			dest = determinedDest
		}
	} else {
		// If the flow type is missing, redirect to the catch-all url
		dest = makeCatchAllDest()
	}

	// If we are sending the visitor to a landing page,
	// set cookies for campaign public ID and click public ID
	// to be retrieved later at /click
	if dest.Type == DestTypeLandingPage {
		setCookie(w, pkg.CookieNameCampaignPublicId, campaign.PublicID)
		setCookie(w, pkg.CookieNameClickPublicId, publicClickId)
	}

	http.Redirect(w, r, dest.URL, http.StatusTemporaryRedirect)

	// If we have an IP Info Token, but we didn't fetch data before,
	// fetch the IP Info now
	if ipInfoToken != "" && !receivedIpInfo {
		data, err := pkg.FetchIpInfo(r.RemoteAddr, ipInfoToken)
		if err != nil {
			fmt.Println("error fetching IP Info: " + err.Error())
		} else {
			ipInfoData = data
			receivedIpInfo = true
		}
	}

	trafficSource, err := storer.GetTrafficSourceById(ctx, campaign.TrafficSourceID)
	if err != nil {
		fmt.Println("error fetching Traffic Source: " + err.Error())
	}

	var affiliateNetwork pkg.AffiliateNetwork
	if dest.Type == DestTypeOffer {
		an, err := storer.GetAffiliateNetworkById(ctx, dest.ID)
		if err != nil {
			fmt.Println("error fetching Affiliate Network: " + err.Error())
		} else {
			affiliateNetwork = an
		}
	}

	// Log click in db
	creationReq := pkg.ClickCreationReq{
		PublicId:           publicClickId,
		ExternalId:         getExternalId(*r.URL, trafficSource),
		Cost:               getCost(*r.URL, trafficSource),
		Revenue:            0,
		ViewTime:           timestamp,
		ClickTime:          getClicktime(dest, timestamp),
		ViewOutputURL:      dest.URL,
		ClickOutputURL:     getClickOutputURL(dest),
		Tokens:             makeTokens(*r.URL, trafficSource),
		IP:                 r.RemoteAddr,
		Isp:                ipInfoData.Org,
		UserAgent:          userAgentStr,
		Language:           pkg.GetLanguage(r),
		Country:            ipInfoData.Country,
		Region:             ipInfoData.Region,
		City:               ipInfoData.City,
		DeviceType:         getDeviceType(ua),
		Device:             ua.Device,
		ScreenResolution:   pkg.GetScreenRes(r),
		Os:                 ua.OS,
		OsVersion:          ua.OSVersion,
		BrowserName:        ua.Name,
		BrowserVersion:     ua.Version,
		AffiliateNetworkID: affiliateNetwork.ID,
		CampaignID:         campaign.ID,
		FlowID:             flow.ID,
		LandingPageID:      getLandingPageID(dest),
		OfferID:            getOfferID(dest),
		TrafficSourceID:    campaign.TrafficSourceID,
	}

	if _, err := storer.CreateNewClick(ctx, creationReq); err != nil {
		fmt.Println("error saving new click to db: " + err.Error())
	}
}

type DetermineDestOptions struct {
	ctx        context.Context
	storer     pkg.Storer
	campaign   pkg.Campaign
	flow       pkg.Flow
	r          *http.Request
	userAgent  useragent.UserAgent
	ipInfoData pkg.IPInfoData
}

type Destination struct {
	Type DestType
	URL  string
	ID   int // The ID of the landing page OR offer where we are sending the visitor
}

type DestType string

const (
	DestTypeLandingPage DestType = "landingPage"
	DestTypeOffer       DestType = "offer"
	DestTypeURL         DestType = "url"
	DestTypeCatchAll    DestType = "catchAll"
)

func determineDest(opts DetermineDestOptions) (Destination, error) {
	// See if we triggered any rule routes
	// If not, we are going using the main route
	route := opts.flow.MainRoute
	for _, ruleRoute := range opts.flow.RuleRoutes {
		if ruleRoute.DoesTrigger(opts.r, opts.userAgent, opts.ipInfoData) {
			route = ruleRoute
			break
		}
	}

	// Filter out the active paths
	activePaths := pkg.FilterSlice[pkg.Path](route.Paths, func(p pkg.Path) bool {
		return p.IsActive
	})

	// Determine what path we are going down,
	// factoring in the weight of each one
	path, err := weightedSelectPath(activePaths)
	if err != nil {
		return makeCatchAllDest(), err
	}

	if !path.DirectLinkingEnabled {
		lpID, err := selectIdUsingRotType[pkg.LandingPage](path.LandingPageIds, opts.campaign.LandingPageRotationType)
		if err != nil {
			return makeCatchAllDest(), err
		}

		lp, err := opts.storer.GetLandingPageById(opts.ctx, lpID)
		if err != nil {
			return makeCatchAllDest(), err
		}

		return Destination{
			Type: DestTypeLandingPage,
			URL:  lp.URL,
			ID:   lp.ID,
		}, nil
	} else {
		oID, err := selectIdUsingRotType[pkg.Offer](path.OfferIds, opts.campaign.OfferRotationType)
		if err != nil {
			return makeCatchAllDest(), err
		}

		o, err := opts.storer.GetOfferById(opts.ctx, oID)
		if err != nil {
			return makeCatchAllDest(), err
		}

		return Destination{
			Type: DestTypeOffer,
			URL:  o.URL,
			ID:   o.ID,
		}, nil
	}
}

func selectIdUsingRotType[T pkg.LandingPage | pkg.Offer](ids []int, rotType db.RotationType) (int, error) {
	if len(ids) == 0 {
		return 0, fmt.Errorf("ids slice is empty")
	}
	if rotType == db.RotationTypeRandom {
		return pkg.RandomItem(ids)
	} else {
		return 0, fmt.Errorf("unknown rotation type: " + string(rotType))
	}
}

func weightedSelectPath(paths []pkg.Path) (*pkg.Path, error) {
	if len(paths) == 0 {
		return nil, fmt.Errorf("paths slice is empty")
	}

	// Calculate the total weight
	totalWeight := 0
	for _, path := range paths {
		totalWeight += path.Weight
	}

	// Generate a random number between 0 and totalWeight-1
	rand.Seed(time.Now().UnixNano())
	r := rand.Intn(totalWeight)

	// Find the path corresponding to the random number
	runningWeight := 0
	for _, path := range paths {
		runningWeight += path.Weight
		if r < runningWeight {
			return &path, nil
		}
	}

	return nil, fmt.Errorf("error selecting path")
}

func getGValue(r *http.Request) string {
	g := r.URL.Query().Get("g")
	if g == "" {
		g = r.URL.Query().Get("G")
	}
	return g
}

func setCookie(w http.ResponseWriter, name pkg.CookieName, value string) {
	cookie := &http.Cookie{
		Name:     string(name),
		Value:    value,
		Path:     "/",
		MaxAge:   0, // No max age
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)
}

func makeCatchAllDest() Destination {
	return Destination{
		Type: DestTypeCatchAll,
		URL:  pkg.GetCatchAllUrl(),
	}
}

// Itterate over all key/value pairs in the query string,
// creating a Token for them if they are listed as custom tokens on the traffic source
func makeTokens(url url.URL, ts pkg.TrafficSource) []pkg.Token {
	tokens := []pkg.Token{}
	query := url.Query()
	for key, val := range query {
		for _, tstoken := range ts.CustomTokens {
			if key == tstoken.QueryParam {
				tokens = append(tokens, pkg.Token{
					QueryParam: key,
					Value:      getTokenValue(val),
				})
			}
		}
	}
	return tokens
}

// Returns the string at index 0 in a slice of strings,
// or an empty string if the slice is empty
func getTokenValue(val []string) string {
	value := ""
	if len(val) > 0 {
		value = val[0]
	}
	return value
}

func getExternalId(url url.URL, ts pkg.TrafficSource) string {
	return url.Query().Get(ts.ExternalIdToken.QueryParam)
}

func getCost(url url.URL, ts pkg.TrafficSource) int {
	costStr := url.Query().Get(ts.CostToken.QueryParam)
	cost, err := strconv.Atoi(costStr)
	if err != nil || cost < 0 {
		return 0
	}
	return cost
}

func getClicktime(dest Destination, timestamp time.Time) time.Time {
	if dest.Type == DestTypeOffer {
		return timestamp
	}
	return time.Time{}
}

func getClickOutputURL(dest Destination) string {
	if dest.Type == DestTypeOffer {
		return dest.URL
	}
	return ""
}

func getDeviceType(ua useragent.UserAgent) string {
	return string(pkg.GetDeviceType(ua))
}

func getLandingPageID(dest Destination) int {
	if dest.Type == DestTypeLandingPage {
		return dest.ID
	}
	return 0
}

func getOfferID(dest Destination) int {
	if dest.Type == DestTypeOffer {
		return dest.ID
	}
	return 0
}
