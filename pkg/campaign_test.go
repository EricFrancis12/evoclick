package pkg

import (
	"net/http"
	"testing"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
	"github.com/stretchr/testify/assert"
)

func TestCampaign(t *testing.T) {
	var mainRoute = Route{
		// The LogicalRelation field is irrelevant for the mainRoute.
		// It is being defined here as an "anchor" to ensure accurate comparison of mainRoute == ruleRoute.
		// mainRoute   ->   LogicalRelationOr
		// ruleRoute   ->   LogicalRelationAnd
		LogicalRelation: LogicalRelationOr,
		Paths: []Path{
			{
				IsActive:       true,
				Weight:         50,
				LandingPageIDs: []int{1, 2, 3},
				OfferIDs:       []int{1, 2, 3},
			},
		},
	}

	t.Run("Redirects to main route over rule routes by default", func(t *testing.T) {
		ruleRoute := Route{
			IsActive:        true,
			LogicalRelation: LogicalRelationAnd,
		}
		campaign := Campaign{
			FlowMainRoute:  mainRoute,
			FlowRuleRoutes: []Route{ruleRoute},
		}

		selectedViewRoute := campaign.SelectViewRoute(http.Request{}, useragent.UserAgent{}, IPInfoData{}, []Token{})

		assert.Equal(t, selectedViewRoute, ruleRoute)
		assert.Equal(t, selectedViewRoute, campaign.FlowRuleRoutes[0])
		assert.NotEqual(t, selectedViewRoute, mainRoute)
		assert.NotEqual(t, selectedViewRoute, campaign.FlowMainRoute)

		selectedClickRoute := campaign.SelectClickRoute(Click{})

		assert.Equal(t, selectedClickRoute, ruleRoute)
		assert.Equal(t, selectedClickRoute, campaign.FlowRuleRoutes[0])
		assert.NotEqual(t, selectedClickRoute, mainRoute)
		assert.NotEqual(t, selectedClickRoute, campaign.FlowMainRoute)
	})
	t.Run("Test campaign.SelectViewRoute() with non-custom RuleName", func(t *testing.T) {
		var (
			ruleRoute = Route{
				IsActive:        true,
				LogicalRelation: LogicalRelationAnd,
				Rules: []Rule{
					{
						RuleName: RuleNameOS,
						Data:     []string{"Windows"},
						Includes: true,
					},
				},
				Paths: []Path{
					{
						IsActive: true,
						Weight:   100,
					},
				},
			}
		)

		campaign := Campaign{
			FlowMainRoute:  mainRoute,
			FlowRuleRoutes: []Route{ruleRoute},
		}

		selectedRoute := campaign.SelectViewRoute(http.Request{}, useragent.UserAgent{OS: "Windows"}, IPInfoData{}, []Token{})

		assert.Equal(t, selectedRoute, ruleRoute)
		assert.Equal(t, selectedRoute, campaign.FlowRuleRoutes[0])
		assert.NotEqual(t, selectedRoute, mainRoute)
		assert.NotEqual(t, selectedRoute, campaign.FlowMainRoute)
	})

	t.Run("Test campaign.SelectViewRoute() with custom RuleName (from traffic source custom tokens)", func(t *testing.T) {
		var (
			queryParam = "zone_id"
			value      = "87654321"
			ruleRoute  = Route{
				IsActive:        true,
				LogicalRelation: LogicalRelationAnd,
				Rules: []Rule{
					{
						RuleName: toCustomRuleName(queryParam),
						Data:     []string{value},
						Includes: true,
					},
				},
				Paths: []Path{
					{
						IsActive: true,
						Weight:   100,
					},
				},
			}
		)

		campaign := Campaign{
			FlowMainRoute:  mainRoute,
			FlowRuleRoutes: []Route{ruleRoute},
		}

		tokens := []Token{
			{
				QueryParam: queryParam,
				Value:      value,
			},
		}

		selectedRoute := campaign.SelectViewRoute(http.Request{}, useragent.UserAgent{}, IPInfoData{}, tokens)

		assert.Equal(t, selectedRoute, ruleRoute)
		assert.Equal(t, selectedRoute, campaign.FlowRuleRoutes[0])
		assert.NotEqual(t, selectedRoute, mainRoute)
		assert.NotEqual(t, selectedRoute, campaign.FlowMainRoute)
	})

	t.Run("Test campaign.SelectClickRoute() with non-custom RuleName", func(t *testing.T) {
		var (
			ruleRoute = Route{
				IsActive:        true,
				LogicalRelation: LogicalRelationAnd,
				Rules: []Rule{
					{
						RuleName: RuleNameOS,
						Data:     []string{"Windows"},
						Includes: true,
					},
				},
				Paths: []Path{
					{
						IsActive: true,
						Weight:   100,
					},
				},
			}
		)

		campaign := Campaign{
			FlowMainRoute:  mainRoute,
			FlowRuleRoutes: []Route{ruleRoute},
		}

		click := Click{
			InnerClick: db.InnerClick{
				Os: "Windows",
			},
		}

		selectedRoute := campaign.SelectClickRoute(click)

		assert.Equal(t, selectedRoute, ruleRoute)
		assert.Equal(t, selectedRoute, campaign.FlowRuleRoutes[0])
		assert.NotEqual(t, selectedRoute, mainRoute)
		assert.NotEqual(t, selectedRoute, campaign.FlowMainRoute)
	})

	t.Run("Test campaign.SelectClickRoute() with custom RuleName (from traffic source custom tokens)", func(t *testing.T) {
		var (
			queryParam = "zone_id"
			value      = "87654321"
			ruleRoute  = Route{
				IsActive:        true,
				LogicalRelation: LogicalRelationAnd,
				Rules: []Rule{
					{
						RuleName: toCustomRuleName(queryParam),
						Data:     []string{value},
						Includes: true,
					},
				},
				Paths: []Path{
					{
						IsActive: true,
						Weight:   100,
					},
				},
			}
		)

		campaign := Campaign{
			FlowMainRoute:  mainRoute,
			FlowRuleRoutes: []Route{ruleRoute},
		}

		click := Click{
			Tokens: []Token{
				{
					QueryParam: queryParam,
					Value:      value,
				},
			},
		}

		selectedRoute := campaign.SelectClickRoute(click)

		assert.Equal(t, selectedRoute, ruleRoute)
		assert.Equal(t, selectedRoute, campaign.FlowRuleRoutes[0])
		assert.NotEqual(t, selectedRoute, mainRoute)
		assert.NotEqual(t, selectedRoute, campaign.FlowMainRoute)
	})
}
