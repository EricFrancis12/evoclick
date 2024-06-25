package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/google/uuid"
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
	ExternalId         string
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
	clickTokensStr := marshallTokens(creationReq.Tokens)
	optParams := makeOptParams(creationReq)

	model, err := s.Client.Click.CreateOne(
		// Mandatory parameters:
		db.Click.PublicID.Set(creationReq.PublicId),
		db.Click.ExternalID.Set(creationReq.ExternalId),
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
		optParams...,
	).Exec(ctx)
	if err != nil {
		return Click{}, err
	}

	return formatClick(model), nil
}

func (s *Storer) UpsertClickById(ctx context.Context, id int, click Click) (Click, error) {
	clickTokensStr := marshallTokens(click.Tokens)
	upsertParams := makeUpsertParams(click)

	model, err := s.Client.Click.UpsertOne(
		db.Click.ID.Equals(id),
	).Create(
		// Mandatory parameters:
		db.Click.PublicID.Set(click.PublicID),
		db.Click.ExternalID.Set(click.ExternalID),
		db.Click.Cost.Set(click.Cost),
		db.Click.Revenue.Set(click.Revenue),
		db.Click.ViewTime.Set(click.ViewTime),
		db.Click.ViewOutputURL.Set(click.ViewOutputURL),
		db.Click.Tokens.Set(clickTokensStr),
		db.Click.IP.Set(click.IP),
		db.Click.UserAgent.Set(click.UserAgent),
		db.Click.Language.Set(click.Language),
		db.Click.DeviceType.Set(click.DeviceType),
		db.Click.Device.Set(click.Device),
		db.Click.ScreenResolution.Set(click.ScreenResolution),
		db.Click.Os.Set(click.Os),
		db.Click.OsVersion.Set(click.OsVersion),
		db.Click.BrowserName.Set(click.BrowserName),
		db.Click.BrowserVersion.Set(click.BrowserVersion),
		db.Click.Campaign.Link(db.Campaign.ID.Equals(click.CampaignID)),
		db.Click.Flow.Link(db.Flow.ID.Equals(click.FlowID)),
		db.Click.TrafficSource.Link(db.TrafficSource.ID.Equals(click.TrafficSourceID)),
	).Update(
		upsertParams...,
	).Exec(ctx)
	if err != nil {
		return Click{}, err
	}
	return formatClick(model), nil
}

func makeOptParams(cp ClickCreationReq) []db.ClickSetParam {
	optParams := []db.ClickSetParam{}
	// Optional parameters that CANNOT accept default values, so they should be ommitted if they are 0
	optParams = appendIfTrue(optParams, db.Click.ClickTime.Set(cp.ClickTime), cp.ClickTime.IsZero())
	optParams = appendIfTrue(optParams, db.Click.ConvTime.Set(cp.ConvTime), cp.ConvTime.IsZero())
	optParams = appendIfTrue(optParams, db.Click.ClickOutputURL.Set(cp.ClickOutputURL), cp.ClickOutputURL != "")
	optParams = appendIfTrue(optParams, db.Click.Isp.Set(cp.Isp), cp.Isp != "")
	optParams = appendIfTrue(optParams, db.Click.Country.Set(cp.Country), cp.Country != "")
	optParams = appendIfTrue(optParams, db.Click.Region.Set(cp.Region), cp.Region != "")
	optParams = appendIfTrue(optParams, db.Click.City.Set(cp.City), cp.City != "")
	optParams = appendIfTrue(optParams, db.Click.AffiliateNetwork.Link(db.AffiliateNetwork.ID.Equals(cp.AffiliateNetworkID)), cp.AffiliateNetworkID != 0)
	optParams = appendIfTrue(optParams, db.Click.LandingPage.Link(db.LandingPage.ID.Equals(cp.LandingPageID)), cp.LandingPageID != 0)
	optParams = appendIfTrue(optParams, db.Click.Offer.Link(db.Offer.ID.Equals(cp.OfferID)), cp.OfferID != 0)
	return optParams
}

func makeUpsertParams(click Click) []db.ClickSetParam {
	clickTokensStr := marshallTokens(click.Tokens)
	params := []db.ClickSetParam{
		// Mandatory parameters:
		db.Click.PublicID.Set(click.PublicID),
		db.Click.ExternalID.Set(click.ExternalID),
		db.Click.Cost.Set(click.Cost),
		db.Click.Revenue.Set(click.Revenue),
		db.Click.ViewTime.Set(click.ViewTime),
		db.Click.ViewOutputURL.Set(click.ViewOutputURL),
		db.Click.Tokens.Set(clickTokensStr),
		db.Click.IP.Set(click.IP),
		db.Click.UserAgent.Set(click.UserAgent),
		db.Click.Language.Set(click.Language),
		db.Click.DeviceType.Set(click.DeviceType),
		db.Click.Device.Set(click.Device),
		db.Click.ScreenResolution.Set(click.ScreenResolution),
		db.Click.Os.Set(click.Os),
		db.Click.OsVersion.Set(click.OsVersion),
		db.Click.BrowserName.Set(click.BrowserName),
		db.Click.BrowserVersion.Set(click.BrowserVersion),
		db.Click.Campaign.Link(db.Campaign.ID.Equals(click.CampaignID)),
		db.Click.Flow.Link(db.Flow.ID.Equals(click.FlowID)),
		db.Click.TrafficSource.Link(db.TrafficSource.ID.Equals(click.TrafficSourceID)),
	}

	// Optional parameters:
	optParams := makeOptParams(ClickCreationReq{
		ClickTime:          click.ClickTime,
		ConvTime:           click.ConvTime,
		ClickOutputURL:     click.ClickOutputURL,
		Isp:                click.Isp,
		Country:            click.Country,
		Region:             click.Region,
		City:               click.City,
		AffiliateNetworkID: click.AffiliateNetworkID,
		LandingPageID:      click.LandingPageID,
		OfferID:            click.OfferID,
	})
	params = append(params, optParams...)
	return params
}

func formatClick(model *db.ClickModel) Click {
	clickTokens := parseClickTokens(model.Tokens)
	return Click{
		InnerClick: model.InnerClick,
		Tokens:     clickTokens,
	}
}

func NewPublicClickID() string {
	return uuid.New().String()
}

func parseClickTokens(jsonStr string) []Token {
	clickTokens, err := ParseJSON[[]Token](jsonStr)
	if err != nil {
		return []Token{}
	}
	return clickTokens
}

func marshallTokens(tokens []Token) string {
	jsonData, err := json.Marshal(tokens)
	if err != nil {
		fmt.Printf("error marshalling to JSON: %s", err)
		return "[]"
	}
	return string(jsonData)
}

func appendIfTrue(params []db.ClickSetParam, p db.ClickSetParam, condition bool) []db.ClickSetParam {
	if condition {
		params = append(params, p)
	}
	return params
}
