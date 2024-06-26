package pkg

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
)

func (s *Storer) GetAllFlows(ctx context.Context) ([]Flow, error) {
	models, err := s.Client.Flow.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatFlows(models), nil
}

func (s *Storer) GetFlowById(ctx context.Context, id int) (Flow, error) {
	key := InitMakeRedisKey("flow")(strconv.Itoa(id))
	// Check redis cache for this flow
	flow, err := CheckRedisForKey[Flow](ctx, s.Cache, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return *flow, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.Flow.FindUnique(
		db.Flow.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return Flow{}, err
	}

	fl := formatFlow(model)

	// If we fetch from the db successfully, create a new key for this flow in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, fl)

	return fl, nil
}

// Checks if the click triggered any rule routes, and if not returns the main route
func (f *Flow) SelectViewRoute(r *http.Request, userAgent useragent.UserAgent, ipInfoData IPInfoData) Route {
	route := f.MainRoute
	for _, ruleRoute := range f.RuleRoutes {
		if !ruleRoute.IsActive {
			continue
		}
		if ruleRoute.ViewDoesTrigger(r, userAgent, ipInfoData) {
			route = ruleRoute
			break
		}
	}
	return route
}

// Checks if the click triggered any rule routes, and if not returns the main route
func (f *Flow) SelectClickRoute(click Click) Route {
	route := f.MainRoute
	for _, ruleRoute := range f.RuleRoutes {
		if !ruleRoute.IsActive {
			continue
		}
		if ruleRoute.ClickDoesTrigger(click) {
			route = ruleRoute
			break
		}
	}
	return route
}

// An API call is needed to obtain this data:
var ipInfoNeeded = map[RuleName]bool{
	RuleNameRegion:  true,
	RuleNameCountry: true,
	RuleNameCity:    true,
	RuleNameISP:     true,
}

func (f *Flow) RulesNeedIpInfo() bool {
	// Loop over all rules to determine if there are
	// any rules that require an API call
	for _, route := range f.RuleRoutes {
		for _, rule := range route.Rules {
			if ipInfoNeeded[rule.RuleName] {
				return true
			}
		}
	}
	return false
}

func formatFlow(model *db.FlowModel) Flow {
	var (
		mainRoute  = getRoute(model.MainRoute)
		ruleRoutes = getRoutes(model.RuleRoutes)
	)
	return Flow{
		InnerFlow:  model.InnerFlow,
		MainRoute:  mainRoute,
		RuleRoutes: ruleRoutes,
	}
}

func formatFlows(models []db.FlowModel) []Flow {
	var flows []Flow
	for _, model := range models {
		fl := formatFlow(&model)
		flows = append(flows, fl)
	}
	return flows
}

type RouteFunc func() (value string, ok bool)

func getRoute(routeFunc RouteFunc) Route {
	jsonStr, ok := routeFunc()
	if !ok {
		return makeInitializedRoute()
	}
	route, err := ParseJSON[Route](jsonStr)
	if err != nil {
		return makeInitializedRoute()
	}
	return route
}

func getRoutes(routeFunc RouteFunc) []Route {
	jsonStr, ok := routeFunc()
	if !ok {
		return []Route{}
	}
	routes, err := ParseJSON[[]Route](jsonStr)
	if err != nil {
		return []Route{}
	}
	return routes
}

func makeInitializedRoute() Route {
	return Route{
		IsActive:        false,
		LogicalRelation: LogicalRelationAnd,
		Rules:           []Rule{},
		Paths:           []Path{},
	}
}
