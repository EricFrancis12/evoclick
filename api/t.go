package handler

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/EricFrancis12/evoclick/pkg"
	"github.com/EricFrancis12/evoclick/prisma/db"
)

func T(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	storer := pkg.NewStorer()
	storer.Renew()

	q := r.URL.Query().Get("q")
	if q == "" {
		// If q is not specifid, redirect to the catch-all url
		fmt.Println("q not specified")
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
	}

	campaign, err := storer.GetCampaignByPublicId(ctx, q)
	if err != nil {
		// If campaign not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Campaign by public ID: " + err.Error())
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
	}

	flow, err := storer.GetFlowById(ctx, campaign.FlowID)
	if err != nil {
		// If flow not found, redirect the visitor to the catch-all url
		fmt.Println("error fetching Flow: " + err.Error())
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
	}

	if flow.Type == db.FlowTypeURL && *flow.URL != "" {
		fmt.Println("Valid URL Flow")
		http.Redirect(w, r, *flow.URL, http.StatusTemporaryRedirect)
	} else if flow.Type == db.FlowTypeBuiltIn || flow.Type == db.FlowTypeSaved {
		if flow.Type == db.FlowTypeBuiltIn {
			fmt.Println("Valid URL Flow")
		} else if flow.Type == db.FlowTypeSaved {
			fmt.Println("Valid Saved Flow")
		}

		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)

		// See if we triggered any rule routes
		// If not, we are going down the main route

		// Now we know what route we are on

		// Filter out the paths on this route that are not active
		// From the remaining paths, determine what path we are going down
		// based path[i].weight

		// Now we know what path we are on

		// If path.directLinkingEnabled == false, we know we are sending them to a landing page
		// 		Determine which landing page (from path.landingPages) we are going to send them to
		// 		based on campaign.landingPageRotation
		//			If path.landingPages is of length 0, send them to the catch-all url

		// If not, we know we are sending them to an offer
		// 		Determine which offer (from path.offers) we are going to send them to
		// 		based on campaign.offerRotation
		//			If path.offers is of length 0, send them to the catch-all url
	} else {
		fmt.Println("Missing or Unknown Flow")
		// If the flow type is missing, redirect to the catch-all url
		http.Redirect(w, r, pkg.GetCatchAllUrl(), http.StatusTemporaryRedirect)
	}

	// Log click in db
	creationReq := pkg.ClickCreationReq{
		// TODO: Fill out defails here
	}

	ipInfoToken := os.Getenv("IP_INFO_TOKEN")
	if ipInfoToken != "" {
		// TODO: fetch data from IP Info and if successful, add to creationReq
	}

	if _, err := storer.CreateNewClick(ctx, creationReq); err != nil {
		fmt.Println("error saving new click to db: " + err.Error())
	}

	return

	// jsonEncoder := json.NewEncoder(w)
	// jsonEncoder.SetIndent("", "  ")

	// debugResponse := &pkg.Response{
	// 	Path:         r.URL.Path,
	// 	QueryStrings: r.URL.Query(),
	// 	Method:       r.Method,
	// 	Message:      "Hello from ./api/t.go",
	// 	Data:         flow,
	// }

	// if err := jsonEncoder.Encode(debugResponse); err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
}
