package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
)

type PostbackResp struct{}

func Postback(w http.ResponseWriter, r *http.Request) {
	timestamp := time.Now()
	ctx := context.Background()
	storer := pkg.NewStorer()
	storer.Renew()

	clickPublicId := r.URL.Query().Get("pid")
	if clickPublicId != "" {
		// Get click from db
		click, err := storer.GetClickByPublicId(ctx, clickPublicId)
		if err != nil {
			fmt.Println("error fetching click by Public ID: " + err.Error())
		} else {
			// Update click in db
			revenue := getRevenue(*r.URL)
			convertedClick := convertClick(click, timestamp, revenue)
			if _, err := storer.UpsertClickById(ctx, click.ID, convertedClick); err != nil {
				fmt.Println("error updating click in db: " + err.Error())
			}

			trafficSource, err := storer.GetTrafficSourceById(ctx, click.TrafficSourceID)
			if err != nil {
				fmt.Println("error fetching traffic source: " + err.Error())
			}
			if trafficSource.PostbackURL != "" {
				go http.Get(trafficSource.FillPostbackURL(click))
			}
		}
	}

	jsonEncoder := json.NewEncoder(w)
	err := jsonEncoder.Encode(PostbackResp{})
	if err != nil {
		fmt.Println("error encoding JSON: " + err.Error())
	}
}

func convertClick(click pkg.Click, convTime time.Time, revenue int) pkg.Click {
	click.ConvTime = convTime
	click.Revenue += revenue
	return click
}

func getRevenue(url url.URL) int {
	payoutStr := url.Query().Get("payout")
	revenue, err := strconv.Atoi(payoutStr)
	if err != nil || revenue < 0 {
		return 0
	}
	return revenue
}
