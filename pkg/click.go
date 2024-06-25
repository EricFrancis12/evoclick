package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetClickById(ctx context.Context, id int) (Click, error) {
	model, err := s.Client.Click.FindUnique(
		db.Click.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return Click{}, err
	}
	return formatClick(model), nil
}

func (s *Storer) GetClickByPublicId(ctx context.Context, publicId string) (Click, error) {
	model, err := s.Client.Click.FindUnique(
		db.Click.PublicID.Equals(publicId),
	).Exec(ctx)
	if err != nil {
		return Click{}, err
	}
	return formatClick(model), nil
}

type ClickCreationReq struct {
	PublicId           string
	Cost               int
	Revenue            int
	ViewTime           time.Time
	ClickTime          time.Time
	ConvTime           time.Time
	ViewOutputURL      string
	ClickOutputURL     string
	Tokens             []Token
	IP                 string
	Isp                string
	UserAgent          string
	Language           string
	Country            string
	Region             string
	City               string
	DeviceType         string
	Device             string
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

func (s *Storer) CreateNewClick(ctx context.Context, creationReq ClickCreationReq) (Click, error) {
	clickTokensStr := "[]"
	jsonData, err := json.Marshal(creationReq.Tokens)
	if err != nil {
		fmt.Printf("error marshalling to JSON: %s", err)
	} else {
		clickTokensStr = string(jsonData)
	}

	optionalParams := []db.ClickSetParam{}
	// Optional parameters that CANNOT accept default values, so they should be ommitted if they are 0
	appendIfTrue(optionalParams, db.Click.ClickTime.Set(creationReq.ClickTime), creationReq.ClickTime.IsZero())
	appendIfTrue(optionalParams, db.Click.ConvTime.Set(creationReq.ConvTime), creationReq.ConvTime.IsZero())
	appendIfTrue(optionalParams, db.Click.ClickOutputURL.Set(creationReq.ClickOutputURL), creationReq.ClickOutputURL != "")
	appendIfTrue(optionalParams, db.Click.Isp.Set(creationReq.Isp), creationReq.Isp != "")
	appendIfTrue(optionalParams, db.Click.Country.Set(creationReq.Country), creationReq.Country != "")
	appendIfTrue(optionalParams, db.Click.Region.Set(creationReq.Region), creationReq.Region != "")
	appendIfTrue(optionalParams, db.Click.City.Set(creationReq.City), creationReq.City != "")
	appendIfTrue(optionalParams, db.Click.AffiliateNetwork.Link(db.AffiliateNetwork.ID.Equals(creationReq.AffiliateNetworkID)), creationReq.AffiliateNetworkID != 0)
	appendIfTrue(optionalParams, db.Click.LandingPage.Link(db.LandingPage.ID.Equals(creationReq.LandingPageID)), creationReq.LandingPageID != 0)
	appendIfTrue(optionalParams, db.Click.Offer.Link(db.Offer.ID.Equals(creationReq.OfferID)), creationReq.OfferID != 0)

	model, err := s.Client.Click.CreateOne(
		// Mandatory parameters:
		db.Click.PublicID.Set(creationReq.PublicId),
		db.Click.Cost.Set(creationReq.Cost),
		db.Click.Revenue.Set(creationReq.Revenue),
		db.Click.ViewTime.Set(creationReq.ViewTime),
		db.Click.ViewOutputURL.Set(creationReq.ViewOutputURL),
		db.Click.Tokens.Set(clickTokensStr),
		db.Click.IP.Set(creationReq.IP),
		db.Click.UserAgent.Set(creationReq.UserAgent),
		db.Click.Language.Set(creationReq.Language),
		db.Click.DeviceType.Set(creationReq.DeviceType),
		db.Click.Device.Set(creationReq.Device),
		db.Click.ScreenResolution.Set(creationReq.ScreenResolution),
		db.Click.Os.Set(creationReq.Os),
		db.Click.OsVersion.Set(creationReq.OsVersion),
		db.Click.BrowserName.Set(creationReq.BrowserName),
		db.Click.BrowserVersion.Set(creationReq.BrowserVersion),
		db.Click.Campaign.Link(db.Campaign.ID.Equals(creationReq.CampaignID)),
		db.Click.Flow.Link(db.Flow.ID.Equals(creationReq.FlowID)),
		db.Click.TrafficSource.Link(db.TrafficSource.ID.Equals(creationReq.TrafficSourceID)),
		// Optional parameters:
		optionalParams...,
	).Exec(ctx)
	if err != nil {
		return Click{}, err
	}

	return formatClick(model), nil
}

func appendIfTrue(params []db.ClickSetParam, p db.ClickSetParam, condition bool) []db.ClickSetParam {
	if condition {
		params = append(params, p)
	}
	return params
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

func formatClick(model *db.ClickModel) Click {
	clickTokens := parseClickTokens(model.Tokens)
	return Click{
		InnerClick: model.InnerClick,
		Tokens:     clickTokens,
	}
}

func parseClickTokens(jsonStr string) []Token {
	clickTokens, err := ParseJSON[[]Token](jsonStr)
	if err != nil {
		return []Token{}
	}
	return clickTokens
}
