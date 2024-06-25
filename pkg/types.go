package pkg

import "github.com/EricFrancis12/evoclick/prisma/db"

type Click struct {
	db.InnerClick
	Tokens []Token
}

type AffiliateNetwork struct {
	db.InnerAffiliateNetwork
}

type Campaign struct {
	db.InnerCampaign
}

type Flow struct {
	db.InnerFlow
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
	ExternalIdToken Token        `json:"externalIdToken"`
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
	LandingPageIds       []int `json:"landingPageIds"`
	OfferIds             []int `json:"offerIds"`
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
	RuleNameUserAgent        RuleName = "userAgent"
	RuleNameLanguage         RuleName = "language"
	RuleNameCountry          RuleName = "counry"
	RuleNameRegion           RuleName = "region"
	RuleNameCity             RuleName = "city"
	RuleNameDeviceType       RuleName = "deviceType"
	RuleNameDevice           RuleName = "device"
	RuleNameScreenResolution RuleName = "screenResolution"
	RuleNameOS               RuleName = "OS"
	RuleNameOSVersion        RuleName = "OSVersion"
	RuleNameBrowserName      RuleName = "browserName"
	RuleNameBrowserVersion   RuleName = "browserVersion"
)

type DeviceType string

const (
	DeviceTypeDesktop DeviceType = "desktop"
	DeviceTypeTablet  DeviceType = "tablet"
	DeviceTypeMobile  DeviceType = "mobile"
	DeviceTypeUnknown DeviceType = "unknown"
)
