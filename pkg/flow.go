package pkg

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
)

func (s *Storer) GetAllSavedFlows(ctx context.Context) ([]SavedFlow, error) {
	models, err := s.Client.SavedFlow.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatSavedFlows(models), nil
}

func (s *Storer) GetSavedFlowById(ctx context.Context, id int) (SavedFlow, error) {
	key := InitMakeRedisKey("flow")(strconv.Itoa(id))
	// Check redis cache for this flow
	savedFlow, err := CheckRedisForKey[SavedFlow](ctx, s.Cache, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return *savedFlow, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.SavedFlow.FindUnique(
		db.SavedFlow.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return SavedFlow{}, err
	}

	fl := formatSavedFlow(model)

	// If we fetch from the db successfully, create a new key for this flow in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, fl)

	return fl, nil
}

func (sf *SavedFlow) SelectViewRoute(r *http.Request, userAgent useragent.UserAgent, ipInfoData IPInfoData) Route {
	return selectViewRoute(sf.MainRoute, sf.RuleRoutes, r, userAgent, ipInfoData)
}

func (sf *SavedFlow) SelectClickRoute(click Click) Route {
	return selectClickRoute(sf.MainRoute, sf.RuleRoutes, click)
}

func (sf *SavedFlow) IpInfoNeeded() bool {
	return IpInfoNeeded(sf.RuleRoutes)
}

func formatSavedFlow(model *db.SavedFlowModel) SavedFlow {
	var (
		mainRoute  = getRoute(model.MainRoute)
		ruleRoutes = getRoutes(model.RuleRoutes)
	)
	return SavedFlow{
		InnerSavedFlow: model.InnerSavedFlow,
		MainRoute:      mainRoute,
		RuleRoutes:     ruleRoutes,
	}
}

func formatSavedFlows(models []db.SavedFlowModel) []SavedFlow {
	var savedFlows []SavedFlow
	for _, model := range models {
		fl := formatSavedFlow(&model)
		savedFlows = append(savedFlows, fl)
	}
	return savedFlows
}

func getRoute(jsonStr string) Route {
	route, err := ParseJSON[Route](jsonStr)
	if err != nil {
		return newInitializedRoute()
	}
	return route
}

func getRoutes(jsonStr string) []Route {
	routes, err := ParseJSON[[]Route](jsonStr)
	if err != nil {
		return []Route{}
	}
	return routes
}

func newInitializedRoute() Route {
	return Route{
		IsActive:        false,
		LogicalRelation: LogicalRelationAnd,
		Rules:           []Rule{},
		Paths:           []Path{},
	}
}
