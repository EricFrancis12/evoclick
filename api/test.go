package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/EricFrancis12/evoclick/pkg"
	"github.com/EricFrancis12/evoclick/prisma/db"
)

func Test(w http.ResponseWriter, r *http.Request) {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		fmt.Errorf(err.Error())
		return
	}

	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	ctx := context.Background()

	// create a affiliate network
	createdAffiliateNetwork, err := client.AffiliateNetwork.CreateOne(
		db.AffiliateNetwork.Name.Set("Hi from Prisma!"),
		db.AffiliateNetwork.DefaultNewOfferString.Set("123"),
	).Exec(ctx)
	if err != nil {
		fmt.Errorf(err.Error())
		return
	}

	result, _ := json.MarshalIndent(createdAffiliateNetwork, "", "  ")
	fmt.Printf("created affiliateNetwork: %s\n", result)

	// find a single affiliate network
	affiliateNetwork, err := client.AffiliateNetwork.FindUnique(
		db.AffiliateNetwork.ID.Equals(createdAffiliateNetwork.ID),
	).Exec(ctx)
	if err != nil {
		fmt.Errorf(err.Error())
		return
	}

	result, _ = json.MarshalIndent(affiliateNetwork, "", "  ")
	fmt.Printf("affiliateNetwork: %s\n", result)

	jsonEncoder := json.NewEncoder(w)
	jsonEncoder.SetIndent("", "  ")

	debugResponse := &pkg.Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/t.go",
	}

	if err := jsonEncoder.Encode(debugResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
