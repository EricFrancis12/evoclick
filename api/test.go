package handler

import (
	"encoding/json"
	"net/http"
	"net/url"
)

// Test response for api routes
type Response struct {
	Path         string     `json:"path"`
	Method       string     `json:"method"`
	QueryStrings url.Values `json:"query_strings"`
	Message      string     `json:"message"`
	Data         any        `json:"data"`
}

func Test(w http.ResponseWriter, r *http.Request) {
	// ctx := context.Background()
	// storer := pkg.NewStorer()
	// storer.Renew()

	// result, err := storer.GetAffiliateNetworkById(ctx, 2)
	// if err != nil {
	// 	fmt.Println("error fetching Affiliate Network", err)
	// 	return
	// }
	// fmt.Println("Fetched Affiliate Network:", result.Name)

	// results, err := storer.GetAllFlows(ctx)
	// if err != nil {
	// 	fmt.Println("error fetching Flow", err)
	// 	return
	// }
	// fmt.Println("Fetched Flows", results)

	// // create new:
	// createdAffiliateNetwork, err := client.AffiliateNetwork.CreateOne(
	// 	db.AffiliateNetwork.Name.Set("Hi from Prisma!"),
	// 	db.AffiliateNetwork.DefaultNewOfferString.Set("123"),
	// ).Exec(ctx)
	// if err != nil {
	// 	fmt.Errorf(err.Error())
	// 	return
	// }

	jsonEncoder := json.NewEncoder(w)
	jsonEncoder.SetIndent("", "  ")

	debugResponse := &Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/test.go",
		Data:         r.URL,
	}

	if err := jsonEncoder.Encode(debugResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
