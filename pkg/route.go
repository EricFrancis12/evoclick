package pkg

import (
	"fmt"
	"net/http"

	"github.com/mileusna/useragent"
)

func NewRoute() Route {
	return Route{
		IsActive:        false,
		LogicalRelation: LogicalRelationAnd,
		Rules:           []Rule{},
		Paths:           []Path{},
	}
}

func (route *Route) ActivePaths() []Path {
	return FilterSlice(route.Paths, func(p Path) bool {
		return p.IsActive
	})
}

func (route *Route) WeightedSelectPath() (Path, error) {
	if len(route.Paths) == 0 {
		return Path{}, fmt.Errorf("paths slice is empty")
	}

	activePaths := route.ActivePaths()
	if len(activePaths) == 0 {
		return Path{}, fmt.Errorf("route has no active paths")
	}

	return determinePath(activePaths)
}

// Determines if any rule in this route triggers based on a given condition
func (route Route) doesTrigger(condition func(rule Rule) bool) bool {
	if !route.IsActive {
		return false
	}

	bools := []bool{}
	for _, rule := range route.Rules {
		bools = append(bools, condition(rule))
	}

	if route.LogicalRelation == LogicalRelationAnd {
		// Check if at least one bool is false
		return !SliceIncludes(bools, false)
	} else if route.LogicalRelation == LogicalRelationOr {
		// Check if at least one bool is true
		return SliceIncludes(bools, true)
	}

	return false
}

// Determines if the view triggers any rules in this route
func (route Route) ViewDoesTrigger(r http.Request, ua useragent.UserAgent, ipInfoData IPInfoData, tokens []Token) bool {
	return route.doesTrigger(func(rule Rule) bool {
		return rule.ViewDoesTrigger(r, ua, ipInfoData, tokens)
	})
}

// Determines if the click triggers any rules in this route
func (route Route) ClickDoesTrigger(click Click) bool {
	return route.doesTrigger(func(rule Rule) bool {
		return rule.ClickDoesTrigger(click)
	})
}

// Checks if the click triggered any rule routes, and if not returns the main route
func selectViewRoute(mainRoute Route, ruleRoutes []Route, r http.Request, userAgent useragent.UserAgent, ipInfoData IPInfoData, tokens []Token) Route {
	route := mainRoute
	for _, ruleRoute := range ruleRoutes {
		if !ruleRoute.IsActive {
			continue
		}
		if ruleRoute.ViewDoesTrigger(r, userAgent, ipInfoData, tokens) {
			route = ruleRoute
			break
		}
	}
	return route
}

// Checks if the click triggered any rule routes, and if not returns the main route
func selectClickRoute(mainRoute Route, ruleRoutes []Route, click Click) Route {
	route := mainRoute
	for _, ruleRoute := range ruleRoutes {
		if !ruleRoute.IsActive {
			continue
		}
		if ruleRoute.ClickDoesTrigger(click) {
			return ruleRoute
		}
	}
	return route
}

// Loop over all routes to determine if there are
// any routes that require an API call
func IpInfoNeeded(routes []Route) bool {
	for _, route := range routes {
		for _, rule := range route.Rules {
			if ipInfoNeededMap[rule.RuleName] {
				return true
			}
		}
	}
	return false
}

// Stores whether or not the RuleName requires an API call to obtain its data
var ipInfoNeededMap = map[RuleName]bool{
	RuleNameRegion:  true,
	RuleNameCountry: true,
	RuleNameCity:    true,
	RuleNameISP:     true,
}
