package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/EricFrancis12/evoclick/pkg"
)

var postbackStorer = pkg.NewStorer()

type PostbackResp struct{}

func Postback(w http.ResponseWriter, r *http.Request) {
	timestamp, ctx := postbackStorer.InitVisit(r)
	pbrch := make(chan pkg.PostbackResult)

	if clickPublicId := getPid(*r.URL); clickPublicId != "" {
		// Get click from db
		click, err := postbackStorer.GetClickByPublicId(ctx, clickPublicId)
		if err != nil {
			fmt.Println("error fetching click by Public ID: " + err.Error())
		} else {
			// Update click in db
			revenue := getRevenue(*r.URL)
			convertedClick := convertClick(click, timestamp, revenue)
			if _, err := postbackStorer.UpsertClickById(ctx, click.ID, convertedClick); err != nil {
				fmt.Println("error updating click in db: " + err.Error())
			}

			trafficSource, err := postbackStorer.GetTrafficSourceById(ctx, click.TrafficSourceID)
			if err != nil {
				fmt.Println("error fetching traffic source: " + err.Error())
			}

			go trafficSource.SendPostback(click, pbrch)
		}
	}

	if os.Getenv(pkg.EnvNodeEnv) == "development" {
		postbackResult := <-pbrch
		if postbackResult.Err != nil {
			fmt.Println(postbackResult.Err.Error())
			w.Header().Set("cypress-redirect-test-result", "fail")
		} else {
			w.Header().Set("cypress-redirect-test-result", "pass")
		}
	}

	err := json.NewEncoder(w).Encode(PostbackResp{})
	if err != nil {
		fmt.Println("error encoding JSON: " + err.Error())
	}
}

func convertClick(click pkg.Click, convTime time.Time, revenue int) pkg.Click {
	click.ConvTime = convTime
	click.Revenue += revenue
	return click
}

func getPid(url url.URL) string {
	return url.Query().Get(string(pkg.QueryParamPid))
}

func getRevenue(url url.URL) int {
	payoutStr := url.Query().Get(string(pkg.QueryParamPayout))
	revenue, err := strconv.Atoi(payoutStr)
	if err != nil || revenue < 0 {
		return 0
	}
	return revenue
}
