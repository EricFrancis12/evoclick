package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
	"github.com/EricFrancis12/evoclick/prisma/db"
)

func Click(w http.ResponseWriter, r *http.Request) {
	timestamp, ctx, storer := pkg.InitRoute()

	clickPublicId := getCookieValue(r, pkg.CookieNameClickPublicID)
	if clickPublicId == "" {
		fmt.Println("no public Click ID found")
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	click, err := storer.GetClickByPublicId(ctx, clickPublicId)
	if err != nil {
		fmt.Println("error fetching click by Public ID: " + err.Error())
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	campaign, err := storer.GetCampaignById(ctx, click.CampaignID)
	if err != nil {
		fmt.Println("error fetching campaign by ID: " + err.Error())
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	var route pkg.Route
	if campaign.FlowType == db.FlowTypeSaved && campaign.SavedFlowID != nil && *campaign.SavedFlowID != 0 {
		savedFlow, err := storer.GetSavedFlowById(ctx, *campaign.SavedFlowID)
		if err != nil {
			fmt.Println("error fetching flow by ID: " + err.Error())
			pkg.RedirectToCatchAllUrl(w, r)
			return
		}
		route = savedFlow.SelectClickRoute(click)
	} else if campaign.FlowType == db.FlowTypeBuiltIn {
		route = campaign.SelectClickRoute(click)
	} else {
		fmt.Println("flow type is not Saved or Built-In")
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	path, err := route.WeightedSelectPath()
	if err != nil {
		fmt.Println("error selecting path: " + err.Error())
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	oID, err := campaign.SelectOfferID(path.OfferIDs)
	if err != nil {
		fmt.Println("error selecting Offer ID: " + err.Error())
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	offer, err := storer.GetOfferById(ctx, oID)
	if err != nil {
		fmt.Println("error fetching offer by ID: " + err.Error())
		pkg.RedirectToCatchAllUrl(w, r)
		return
	}

	pkg.RedirectVisitor(w, r, offer.URL)

	// Update clickTime and clickOutputUrl
	updatedClick := updateClick(click, timestamp, offer.URL)

	// Save updated click to db
	if _, err := storer.UpsertClickById(ctx, click.ID, updatedClick); err != nil {
		fmt.Println("error updating click in db: " + err.Error())
	}
}

func updateClick(click pkg.Click, clickTime time.Time, clickOutputUrl string) pkg.Click {
	click.ClickTime = clickTime
	click.ClickOutputURL = clickOutputUrl
	return click
}

func getCookieValue(r *http.Request, cn pkg.CookieName) string {
	cookie, err := r.Cookie(string(cn))
	if err != nil {
		return ""
	}
	return cookie.Value
}
