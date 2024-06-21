package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/EricFrancis12/evoclick/pkg"
)

var storer = pkg.NewStorer()

func Test(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	storer.Renew()

	result, err := storer.GetFlowById(ctx, 2)
	if err != nil {
		fmt.Println("error fetching Flows", err)
		return
	}
	fmt.Println("Fetched Flow", result)

	results, err := storer.GetAllFlows(ctx)
	if err != nil {
		fmt.Println("error fetching Flow", err)
		return
	}
	fmt.Println("Fetched Flows", results)

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

	debugResponse := &pkg.Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/test.go",
		Data:         storer,
	}

	if err := jsonEncoder.Encode(debugResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
