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

	// campaignPublicId := getCookieValue(r, pkg.CookieNameCampaignPublicId)
	clickPublicId := getCookieValue(r, pkg.CookieNameClickPublicId)

	if clickPublicId == "" {
		fmt.Println("no public Click ID found")
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	var (
		campaign pkg.Campaign
		flow     pkg.Flow
		offer    pkg.Offer
		click    pkg.Click
	)

	cl, err := storer.GetClickByPublicId(ctx, clickPublicId)
	if err != nil {
		fmt.Println("error fetching click by Public ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	} else {
		click = cl
	}

	c, err := storer.GetCampaignById(ctx, click.CampaignID)
	if err != nil {
		fmt.Println("error fetching campaign by ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	} else {
		campaign = c
	}

	fl, err := storer.GetFlowById(ctx, click.FlowID)
	if err != nil {
		fmt.Println("error fetching flow by ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	} else {
		flow = fl
	}

	// See if we triggered any rule routes
	// If not, we are going using the main route
	route := flow.MainRoute
	for _, ruleRoute := range flow.RuleRoutes {
		if !ruleRoute.IsActive {
			continue
		}
		if ruleRoute.ClickDoesTrigger(click) {
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
		fmt.Println("error selecting path: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	oID, err := selectIdUsingRotType[pkg.Offer](path.OfferIds, campaign.OfferRotationType)
	if err != nil {
		fmt.Println("error selecting Offer ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	}

	o, err := storer.GetOfferById(ctx, oID)
	if err != nil {
		fmt.Println("error fetching offer by ID: " + err.Error())
		http.Redirect(w, r, pkg.CatchAllUrl(), http.StatusTemporaryRedirect)
		return
	} else {
		offer = o
		http.Redirect(w, r, offer.URL, http.StatusTemporaryRedirect)
	}

	// Update clickTime and clickOutputUrl
	updatedClick := updateClick(click, timestamp, offer.URL)

	// Save updated click to db
	if _, err := storer.UpsertClickById(ctx, click.ID, updatedClick); err != nil {
		fmt.Println("error updating click in db: " + err.Error())
	}
}

func updateClick(click pkg.Click, clickTime time.Time, clickOutputUrl string) pkg.Click {
	click.ClickTime = &clickTime
	click.ClickOutputURL = &clickOutputUrl
	return click
}

func getCookieValue(r *http.Request, cn pkg.CookieName) string {
	cookie, err := r.Cookie(string(cn))
	if err != nil {
		return ""
	}
	return cookie.Value
}
