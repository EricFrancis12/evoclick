package handler

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
)

func Click(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now()
	ctx := context.Background()
	storer := pkg.NewStorer()
	storer.Renew()

	clickPublicId := getCookieValue(r, pkg.CookieNameClickPublicID)
	if clickPublicId == "" {
		fmt.Println("no public Click ID found")
		http.Redirect(w, r, pkg.CatchAllUrl("1"), http.StatusTemporaryRedirect)
		return
	}

	click, err := storer.GetClickByPublicId(ctx, clickPublicId)
	if err != nil {
		fmt.Println("error fetching click by Public ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl("2"), http.StatusTemporaryRedirect)
		return
	}

	campaign, err := storer.GetCampaignById(ctx, click.CampaignID)
	if err != nil {
		fmt.Println("error fetching campaign by ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl("3"), http.StatusTemporaryRedirect)
		return
	}

	flow, err := storer.GetFlowById(ctx, click.FlowID)
	if err != nil {
		fmt.Println("error fetching flow by ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl("4"), http.StatusTemporaryRedirect)
		return
	}

	route := flow.SelectClickRoute(click)
	path, err := route.WeightedSelectPath()
	if err != nil {
		fmt.Println("error selecting path: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl("5"), http.StatusTemporaryRedirect)
		return
	}

	oID, err := selectIdUsingRotType[pkg.Offer](path.OfferIDs, campaign.OfferRotationType)
	if err != nil {
		fmt.Println("error selecting Offer ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl("6"), http.StatusTemporaryRedirect)
		return
	}

	offer, err := storer.GetOfferById(ctx, oID)
	if err != nil {
		fmt.Println("error fetching offer by ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl("7"), http.StatusTemporaryRedirect)
		return
	}

	http.Redirect(w, r, offer.URL, http.StatusTemporaryRedirect)

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
