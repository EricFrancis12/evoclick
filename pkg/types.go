package pkg

import "github.com/EricFrancis12/evoclick/prisma/db"

type Click struct {
	db.InnerClick
	Tokens []ClickToken
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
	DefaultTokens []Token `json:"defaultTokens"`
	CustomTokens  []Token `json:"customTokens"`
}

type Token struct {
	ClickToken
	Name string `json:"name"`
}

type ClickToken struct {
	QueryParam string `json:"queryParam"`
	Value      string `json:"value"`
}

type Route struct {
	IsActive        bool   `json:"isActive"`
	LogicalRelation string `json:"logicalRelation"`
	Rules           []Rule `json:"rules"`
	Paths           []Path `json:"paths"`
}

type Rule struct {
	ItemName  string   `json:"itemName"`
	ClickProp string   `json:"clickProp"`
	DoesEqual bool     `json:"doesEqual"`
	Data      []string `json:"data"`
}

type Path struct {
	IsActive             bool  `json:"isActive"`
	Weight               int   `json:"weight"` // Ranges from 0 to 100
	LandingPageIds       []int `json:"landingPageIds"`
	OfferIds             []int `json:"offerIds"`
	DirectLinkingEnabled bool  `json:"directLinkingEnabled"`
}
