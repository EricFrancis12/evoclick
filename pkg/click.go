package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetClickById(ctx context.Context, id int) (*Click, error) {
	model, err := s.Client.Click.FindUnique(
		db.Click.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatClick(model), nil
}

type ClickCreationReq struct {
	Cost               int
	Revenue            int
	ViewTime           time.Time
	ClickTime          time.Time
	ConvTime           time.Time
	ViewOutputURL      string
	ClickOutputURL     string
	Tokens             []ClickToken
	IP                 string
	Isp                string
	UserAgent          string
	Language           string
	Country            string
	Region             string
	City               string
	MobileCarrier      string
	DeviceType         string
	DeviceModel        string
	DeviceVendor       string
	ScreenResolution   string
	Os                 string
	OsVersion          string
	BrowserName        string
	BrowserVersion     string
	AffiliateNetworkID int
	CampaignID         int
	FlowID             int
	LandingPageID      int
	OfferID            int
	TrafficSourceID    int
}

func (s *Storer) CreateNewClick(ctx context.Context, creationReq ClickCreationReq) (*Click, error) {
	clickTokensStr := "[]"
	jsonData, err := json.Marshal(creationReq.Tokens)
	if err != nil {
		fmt.Printf("error marshalling to JSON: %s", err)
	} else {
		clickTokensStr = string(jsonData)
	}

	model, err := s.Client.Click.CreateOne(
		// Mandatory parameters:
		db.Click.Cost.Set(creationReq.Cost),
		db.Click.Revenue.Set(creationReq.Revenue),
		db.Click.ViewTime.Set(creationReq.ViewTime),
		db.Click.ViewOutputURL.Set(creationReq.ViewOutputURL),
		db.Click.Tokens.Set(clickTokensStr),
		db.Click.IP.Set(creationReq.IP),
		db.Click.Isp.Set(creationReq.Isp),
		db.Click.UserAgent.Set(creationReq.UserAgent),
		db.Click.Language.Set(creationReq.Language),
		db.Click.Country.Set(creationReq.Country),
		db.Click.Region.Set(creationReq.Region),
		db.Click.City.Set(creationReq.City),
		db.Click.MobileCarrier.Set(creationReq.MobileCarrier),
		db.Click.DeviceType.Set(creationReq.DeviceType),
		db.Click.DeviceModel.Set(creationReq.DeviceModel),
		db.Click.DeviceVendor.Set(creationReq.DeviceVendor),
		db.Click.ScreenResolution.Set(creationReq.ScreenResolution),
		db.Click.Os.Set(creationReq.Os),
		db.Click.OsVersion.Set(creationReq.OsVersion),
		db.Click.BrowserName.Set(creationReq.BrowserName),
		db.Click.BrowserVersion.Set(creationReq.BrowserVersion),
		db.Click.AffiliateNetwork.Link(db.AffiliateNetwork.ID.Equals(creationReq.AffiliateNetworkID)),
		db.Click.Campaign.Link(db.Campaign.ID.Equals(creationReq.CampaignID)),
		db.Click.Flow.Link(db.Flow.ID.Equals(creationReq.FlowID)),
		db.Click.LandingPage.Link(db.LandingPage.ID.Equals(creationReq.LandingPageID)),
		db.Click.Offer.Link(db.Offer.ID.Equals(creationReq.OfferID)),
		db.Click.TrafficSource.Link(db.TrafficSource.ID.Equals(creationReq.TrafficSourceID)),

		// Optional parameters:
		db.Click.ClickTime.Set(creationReq.ClickTime),
		db.Click.ConvTime.Set(creationReq.ConvTime),
		db.Click.ClickOutputURL.Set(creationReq.ClickOutputURL),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	return formatClick(model), nil
}

// func (s *Storer) UpsertClickById(ctx context.Context, id int, params ...db.ClickSetParam) (*Click, error) {
// 	model, err := s.Client.Click.UpsertOne(
// 		db.Click.ID.Equals(id),
// 	).Create(
// 		params...,
// 	).Update(
// 		params...,
// 	).Exec(ctx)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return formatClick(model), nil
// }

func formatClick(model *db.ClickModel) *Click {
	clickTokens := parseClickTokens(model.Tokens)
	return &Click{
		InnerClick: model.InnerClick,
		Tokens:     clickTokens,
	}
}

func parseClickTokens(jsonStr string) []ClickToken {
	clickTokens, err := parseJSON[[]ClickToken](jsonStr)
	if err != nil {
		return []ClickToken{}
	}
	return clickTokens
}
