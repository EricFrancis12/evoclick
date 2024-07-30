package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
)

var tStorer = pkg.NewStorer()

func T(w http.ResponseWriter, r *http.Request) {
	timestamp, ctx := tStorer.InitVisit(r)

	g := getGValue(r)
	if g == "" {
		// If g is not specified we have no way of fetching the campaign,
		// so redirect to the catch-all url
		fmt.Println("g value not specified")
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	campaign, err := tStorer.GetCampaignByPublicId(ctx, g)
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

	ipidch := make(chan pkg.IPInfoData)
	go fetchIpInfoData(r, os.Getenv(pkg.EnvIpInfoToken), ipidch)

	tsch := make(chan pkg.TrafficSource)
	go fetchtrafficSource(ctx, tStorer, campaign.TrafficSourceID, tsch)

	if campaign.FlowType == db.FlowTypeSaved {
		savedFlow, err = tStorer.GetSavedFlowById(ctx, *campaign.SavedFlowID)
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

	// If determining the destination requires ipInfoData, wait for the channel response
	if visitorNeedsIpInfoData {
		ipInfoData = <-ipidch
	}

	publicClickId := pkg.NewPublicClickID()
	dest, _ := campaign.DetermineViewDestination(pkg.DestinationOpts{
		R:             *r,
		Ctx:           ctx,
		Storer:        *tStorer,
		SavedFlow:     savedFlow,
		UserAgent:     userAgent,
		IpInfoData:    ipInfoData,
		PublicClickId: publicClickId,
	})

	anch := make(chan pkg.AffiliateNetwork)
	go fetchAffiliateNetwork(ctx, tStorer, dest, anch)

	// If we are sending the visitor to a landing page,
	// set cookies to be retrieved later at /click
	if dest.Type == pkg.DestTypeLandingPage {
		setCookie(w, pkg.CookieNameCampaignPublicID, campaign.PublicID)
		setCookie(w, pkg.CookieNameClickPublicID, publicClickId)
	}

	pkg.RedirectVisitor(w, r, dest.URL)

	// If we did not pull from the ipInfoData channel before the redirect, pull from it now
	if !visitorNeedsIpInfoData {
		ipInfoData = <-ipidch
	}
	trafficSource := <-tsch
	affiliateNetwork := <-anch

	// Save click to db
	_, err = tStorer.CreateNewClick(ctx, pkg.ClickCreationReq{
		PublicId:           publicClickId,
		ExternalId:         trafficSource.GetExternalId(*r.URL),
		Cost:               trafficSource.GetCost(*r.URL),
		Revenue:            0,
		ViewTime:           timestamp,
		ClickTime:          getClicktime(dest, timestamp),
		ViewOutputURL:      dest.URL,
		ClickOutputURL:     getClickOutputURL(dest),
		Tokens:             trafficSource.MakeTokens(*r.URL),
		IP:                 r.RemoteAddr,
		Isp:                ipInfoData.Org,
		UserAgent:          r.UserAgent(),
		Language:           pkg.GetLanguage(*r),
		Country:            ipInfoData.Country,
		Region:             ipInfoData.Region,
		City:               ipInfoData.City,
		DeviceType:         getDeviceType(userAgent),
		Device:             userAgent.Device,
		ScreenResolution:   pkg.GetScreenRes(*r),
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
	if err != nil {
		fmt.Println("error saving new click to db: " + err.Error())
	}
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
	qp := string(pkg.QueryParamG)
	g := r.URL.Query().Get(strings.ToLower(qp))
	if g == "" {
		g = r.URL.Query().Get(strings.ToUpper(qp))
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
