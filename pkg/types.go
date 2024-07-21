package pkg

import (
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

const (
	EnvPort                string = "PORT"
	EnvApiPort             string = "API_PORT"
	EnvNodeEnv             string = "NODE_ENV"
	EnvCatchAllRedirectUrl string = "CATCH_ALL_REDIRECT_URL"
	EnvIpInfoToken         string = "IP_INFO_TOKEN"
	EnvRedisUrl            string = "REDIS_URL"
)

type Click struct {
	db.InnerClick
	ClickTime          time.Time `json:"clickTime"`
	ConvTime           time.Time `json:"convTime"`
	ClickOutputURL     string    `json:"clickOutputURL"`
	Isp                string    `json:"isp"`
	Country            string    `json:"country"`
	Region             string    `json:"region"`
	City               string    `json:"city"`
	Tokens             []Token   `json:"tokens"`
	AffiliateNetworkID int       `json:"affiliateNetworkID"`
	SavedFlowID        int       `json:"savedFlowID"`
	LandingPageID      int       `json:"landingPageID"`
	OfferID            int       `json:"offerID"`
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
	SavedFlowID        int
	LandingPageID      int
	OfferID            int
	TrafficSourceID    int
}

type AffiliateNetwork struct {
	db.InnerAffiliateNetwork
}

type Campaign struct {
	db.InnerCampaign
	FlowMainRoute  Route   `json:"mainRoute"`
	FlowRuleRoutes []Route `json:"ruleRoutes"`
}

type SavedFlow struct {
	db.InnerSavedFlow
	MainRoute  Route   `json:"mainRoute"`
	RuleRoutes []Route `json:"ruleRoutes"`
}

type LandingPage struct {
	db.InnerLandingPage
}

type Offer struct {
	db.InnerOffer
}

type TrafficSource struct {
	db.InnerTrafficSource
	PostbackURL     string       `json:"postbackURL"`
	ExternalIDToken Token        `json:"externalIDToken"`
	CostToken       Token        `json:"costToken"`
	CustomTokens    []NamedToken `json:"customTokens"`
}

type Token struct {
	QueryParam string `json:"queryParam"`
	Value      string `json:"value"`
}

type NamedToken struct {
	Token
	Name string `json:"name"`
}

type Route struct {
	IsActive        bool            `json:"isActive"`
	LogicalRelation LogicalRelation `json:"logicalRelation"`
	Rules           []Rule          `json:"rules"`
	Paths           []Path          `json:"paths"`
}

type Rule struct {
	RuleName RuleName `json:"ruleName"`
	Data     []string `json:"data"`
	Includes bool     `json:"includes"`
}

type Path struct {
	IsActive             bool  `json:"isActive"`
	Weight               int   `json:"weight"` // Ranges from 0 to 100
	LandingPageIDs       []int `json:"landingPageIDs"`
	OfferIDs             []int `json:"offerIDs"`
	DirectLinkingEnabled bool  `json:"directLinkingEnabled"`
}

type IPInfoData struct {
	IP       string `json:"ip"`       // example: "12.34.567.8"
	Hostname string `json:"hostname"` // example: "any.subdomains.hostname.com"
	City     string `json:"city"`     // example: "Aarhus"
	Region   string `json:"region"`   // example: "Central Jutland"
	Country  string `json:"country"`  // example: "DK"
	Loc      string `json:"loc"`      // example: "95.1567,34.2108"
	Org      string `json:"org"`      // example: "AS6SB9 Telenor A/S"
	Postal   string `json:"postal"`   // example: "4883"
	Timezone string `json:"-"`        // example: "Europe/Copenhagen"
}

type LogicalRelation string

const (
	LogicalRelationAnd LogicalRelation = "and"
	LogicalRelationOr  LogicalRelation = "or"
)

type RuleName string

const (
	RuleNameIP               RuleName = "IP"
	RuleNameISP              RuleName = "ISP"
	RuleNameUserAgent        RuleName = "User Agent"
	RuleNameLanguage         RuleName = "Language"
	RuleNameCountry          RuleName = "Country"
	RuleNameRegion           RuleName = "Region"
	RuleNameCity             RuleName = "City"
	RuleNameDeviceType       RuleName = "Device Type"
	RuleNameDevice           RuleName = "Device"
	RuleNameScreenResolution RuleName = "Screen Resolution"
	RuleNameOS               RuleName = "OS"
	RuleNameOSVersion        RuleName = "OS Version"
	RuleNameBrowserName      RuleName = "Browser Name"
	RuleNameBrowserVersion   RuleName = "Browser Version"
)

type DeviceType string

const (
	DeviceTypeDesktop DeviceType = "desktop"
	DeviceTypeTablet  DeviceType = "tablet"
	DeviceTypeMobile  DeviceType = "mobile"
	DeviceTypeUnknown DeviceType = "unknown"
)

type CookieName string

const (
	CookieNameCampaignPublicID CookieName = "campaignPublicID"
	CookieNameClickPublicID    CookieName = "clickPublicID"
)

type Destination struct {
	Type DestType
	URL  string
	ID   int // The ID of the landing page OR offer the visitor will being redirected to
}

type DestType string

const (
	DestTypeLandingPage DestType = "landingPage"
	DestTypeOffer       DestType = "offer"
	DestTypeURL         DestType = "url"
	DestTypeCatchAll    DestType = "catchAll"
)

type QueryParam string

const (
	QueryParamG QueryParam = "g"
)
