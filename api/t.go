package api

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
	fmt.Println("~ 1")

	timestamp, ctx, storer := pkg.InitVisit()

	fmt.Println("~ 2")

	g := getGValue(r)
	if g == "" {
		// If g is not specified we have no way of fetching the campaign,
		// so redirect to the catch-all url
		fmt.Println("g value not specified")
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	fmt.Println("~ 3")

	campaign, err := storer.GetCampaignByPublicId(ctx, g)
	if err != nil {
		// If campaign not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Campaign by public ID: " + err.Error())
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	var (
		ipInfoData             = pkg.IPInfoData{}
		visitorNeedsIpInfoData = false
		userAgent              = useragent.Parse(r.UserAgent())
		savedFlow              = pkg.SavedFlow{}
	)

	fmt.Println("~ 4")

	ipidch := make(chan pkg.IPInfoData)
	go fetchIpInfoData(r, os.Getenv(pkg.EnvIpInfoToken), ipidch)

	fmt.Println("~ 5")

	tsch := make(chan pkg.TrafficSource)
	go fetchtrafficSource(ctx, storer, campaign.TrafficSourceID, tsch)

	fmt.Println("~ 6")

	if campaign.FlowType == db.FlowTypeSaved {
		savedFlow, err = storer.GetSavedFlowById(ctx, *campaign.SavedFlowID)
		if err != nil {
			// If flow not found, redirect the visitor to the catch-all url
			fmt.Println("error fetching Flow: " + err.Error())
			pkg.RedirectToCatchAllUrl(w, r)
			return
		}
		visitorNeedsIpInfoData = savedFlow.IpInfoNeeded()
	} else if campaign.FlowType == db.FlowTypeBuiltIn {
		visitorNeedsIpInfoData = campaign.IpInfoNeeded()
	}

	fmt.Println("~ 7")

	// If determining the destination requires ipinfoData, wait for the channel response
	if visitorNeedsIpInfoData {
		ipInfoData = <-ipidch
	}

	fmt.Println("~ 8")

	dest, _ := campaign.DetermineViewDestination(r, ctx, *storer, savedFlow, userAgent, ipInfoData)

	fmt.Println("~ 9")

	anch := make(chan pkg.AffiliateNetwork)
	go fetchAffiliateNetwork(ctx, storer, dest, anch)

	fmt.Println("~ 10")

	publicClickId := pkg.NewPublicClickID()
	// If we are sending the visitor to a landing page,
	// set cookies to be retrieved later at /click
	if dest.Type == pkg.DestTypeLandingPage {
		setCookie(w, pkg.CookieNameCampaignPublicID, campaign.PublicID)
		setCookie(w, pkg.CookieNameClickPublicID, publicClickId)
	}

	fmt.Println("~ 11")

	pkg.RedirectVisitor(w, r, dest.URL)

	fmt.Println("~ 12")

	// If we did not pull from the ipInfoData channel before the redirect, pull from it now
	if !visitorNeedsIpInfoData {
		ipInfoData = <-ipidch
	}

	fmt.Println("~ 13")

	trafficSource := <-tsch

	fmt.Println("~ 14")

	affiliateNetwork := <-anch

	fmt.Println("~ 15")

	// Save click to db
	_, err = storer.CreateNewClick(ctx, pkg.ClickCreationReq{
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
		UserAgent:          r.UserAgent(),
		Language:           pkg.GetLanguage(r),
		Country:            ipInfoData.Country,
		Region:             ipInfoData.Region,
		City:               ipInfoData.City,
		DeviceType:         getDeviceType(userAgent),
		Device:             userAgent.Device,
		ScreenResolution:   pkg.GetScreenRes(r),
		Os:                 userAgent.OS,
		OsVersion:          userAgent.OSVersion,
		BrowserName:        userAgent.Name,
		BrowserVersion:     userAgent.Version,
		AffiliateNetworkID: affiliateNetwork.ID,
		CampaignID:         campaign.ID,
		SavedFlowID:        savedFlow.ID,
		LandingPageID:      getLandingPageID(dest),
		OfferID:            getOfferID(dest),
		TrafficSourceID:    campaign.TrafficSourceID,
	})

	fmt.Println("~ 16")

	if err != nil {
		fmt.Println("error saving new click to db: " + err.Error())
	}

	fmt.Println("~ 17")
}

func fetchIpInfoData(r *http.Request, ipInfoToken string, ch chan pkg.IPInfoData) {
	if ipInfoToken == "" {
		fmt.Println("IP Info token is an empty string")
		ch <- pkg.IPInfoData{}
		return
	}

	data, err := pkg.CustomClient.FetchIpInfoData(r.RemoteAddr, ipInfoToken)
	if err != nil {
		fmt.Println("Error fetching IP Info: " + err.Error())
		ch <- pkg.IPInfoData{}
		return
	}

	ch <- data
}

func fetchAffiliateNetwork(ctx context.Context, storer *pkg.Storer, dest pkg.Destination, ch chan pkg.AffiliateNetwork) {
	if dest.Type != pkg.DestTypeOffer {
		ch <- pkg.AffiliateNetwork{}
		return
	}

	affiliateNetwork, err := storer.GetAffiliateNetworkById(ctx, dest.ID)
	if err != nil {
		fmt.Println("error fetching Affiliate Network: " + err.Error())
		ch <- pkg.AffiliateNetwork{}
		return
	}

	ch <- affiliateNetwork
}

func fetchtrafficSource(ctx context.Context, storer *pkg.Storer, id int, ch chan pkg.TrafficSource) {
	trafficSource, err := storer.GetTrafficSourceById(ctx, id)
	if err != nil {
		fmt.Println("error fetching Traffic Source: " + err.Error())
		ch <- pkg.TrafficSource{}
		return
	}
	ch <- trafficSource
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

func getClicktime(dest pkg.Destination, timestamp time.Time) time.Time {
	if dest.Type == pkg.DestTypeOffer {
		return timestamp
	}
	return time.Time{}
}

func getClickOutputURL(dest pkg.Destination) string {
	if dest.Type == pkg.DestTypeOffer {
		return dest.URL
	}
	return ""
}

func getDeviceType(ua useragent.UserAgent) string {
	return string(pkg.GetDeviceType(ua))
}

func getLandingPageID(dest pkg.Destination) int {
	if dest.Type == pkg.DestTypeLandingPage {
		return dest.ID
	}
	return 0
}

func getOfferID(dest pkg.Destination) int {
	if dest.Type == pkg.DestTypeOffer {
		return dest.ID
	}
	return 0
}
