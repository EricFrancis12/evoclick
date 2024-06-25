package handler

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
)

func T(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now()
	ctx := context.Background()
	storer := pkg.NewStorer()
	storer.Renew()

	g := getGValue(r)
	if g == "" {
		// If g is not specified we have no way of fetching the campaign,
		// so redirect to the catch-all url
		fmt.Println("g not specified")
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	campaign, err := storer.GetCampaignByPublicId(ctx, g)
	if err != nil {
		// If campaign not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Campaign by public ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	flow, err := storer.GetFlowById(ctx, campaign.FlowID)
	if err != nil {
		// If flow not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Flow: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	var (
		ipInfoData     pkg.IPInfoData
		receivedIpInfo = false
		userAgentStr   = r.UserAgent()
		ua             = useragent.Parse(userAgentStr)
		publicClickId  = pkg.NewPublicClickID()
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

	dest, _ := determineDest(DestOpts{
		ctx:        ctx,
		storer:     *storer,
		campaign:   campaign,
		flow:       flow,
		r:          r,
		userAgent:  ua,
		ipInfoData: ipInfoData,
	})

	// If we are sending the visitor to a landing page,
	// set cookies to be retrieved later at /click
	if dest.Type == DestTypeLandingPage {
		setCookie(w, pkg.CookieNameCampaignPublicID, campaign.PublicID)
		setCookie(w, pkg.CookieNameClickPublicID, publicClickId)
	}

	http.Redirect(w, r, dest.URL, http.StatusTemporaryRedirect)

	// If we have an IP Info Token, AND we didn't fetch data before,
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

type Destination struct {
	Type DestType
	URL  string
	ID   int // The ID of the landing page OR offer the visitor will being redirected to
}

type DestOpts struct {
	ctx        context.Context
	storer     pkg.Storer
	campaign   pkg.Campaign
	flow       pkg.Flow
	r          *http.Request
	userAgent  useragent.UserAgent
	ipInfoData pkg.IPInfoData
}

type DestType string

const (
	DestTypeLandingPage DestType = "landingPage"
	DestTypeOffer       DestType = "offer"
	DestTypeURL         DestType = "url"
	DestTypeCatchAll    DestType = "catchAll"
)

func determineDest(opts DestOpts) (Destination, error) {
	if opts.flow.Type == db.FlowTypeURL && opts.flow.URL != "" {
		return Destination{
			Type: DestTypeURL,
			URL:  opts.flow.URL,
		}, nil
	} else if opts.flow.Type == db.FlowTypeBuiltIn || opts.flow.Type == db.FlowTypeSaved {
		route := opts.flow.SelectViewRoute(opts.r, opts.userAgent, opts.ipInfoData)
		path, err := route.WeightedSelectPath()
		if err != nil {
			return catchAllDest(), err
		}

		if !path.DirectLinkingEnabled {
			lpID, err := selectIdUsingRotType[pkg.LandingPage](path.LandingPageIDs, opts.campaign.LandingPageRotationType)
			if err != nil {
				return catchAllDest(), err
			}

			lp, err := opts.storer.GetLandingPageById(opts.ctx, lpID)
			if err != nil {
				return catchAllDest(), err
			}

			return Destination{
				Type: DestTypeLandingPage,
				URL:  lp.URL,
				ID:   lp.ID,
			}, nil
		} else {
			oID, err := selectIdUsingRotType[pkg.Offer](path.OfferIDs, opts.campaign.OfferRotationType)
			if err != nil {
				return catchAllDest(), err
			}

			o, err := opts.storer.GetOfferById(opts.ctx, oID)
			if err != nil {
				return catchAllDest(), err
			}

			return Destination{
				Type: DestTypeOffer,
				URL:  o.URL,
				ID:   o.ID,
			}, nil
		}
	}
	return catchAllDest(), fmt.Errorf("missing or unknown flow type")
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

func catchAllDest() Destination {
	return Destination{
		Type: DestTypeCatchAll,
		URL:  pkg.CatchAllUrl(),
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
	return url.Query().Get(ts.ExternalIDToken.QueryParam)
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
