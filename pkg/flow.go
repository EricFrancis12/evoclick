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
	key := s.MakeRedisKeyFunc("flow")(strconv.Itoa(id))
	// Check redis cache for this flow
	savedFlow, err := CheckRedisForKey[SavedFlow](s.Cache, ctx, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return savedFlow, nil
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
	defer s.SaveKeyToRedis(ctx, key, fl)

	return fl, nil
}

func (sf *SavedFlow) SelectViewRoute(r http.Request, userAgent useragent.UserAgent, ipInfoData IPInfoData, tokens []Token) Route {
	return selectViewRoute(sf.MainRoute, sf.RuleRoutes, r, userAgent, ipInfoData, tokens)
}

func (sf *SavedFlow) SelectClickRoute(click Click) Route {
	return selectClickRoute(sf.MainRoute, sf.RuleRoutes, click)
}

func (sf *SavedFlow) IpInfoNeeded() bool {
	return IpInfoNeeded(sf.RuleRoutes)
}

func formatSavedFlow(model *db.SavedFlowModel) SavedFlow {
	return SavedFlow{
		InnerSavedFlow: model.InnerSavedFlow,
		MainRoute:      parseRoute(model.MainRoute),
		RuleRoutes:     parseRoutes(model.RuleRoutes),
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

func parseRoute(jsonStr string) Route {
	route, err := ParseJSON[Route](jsonStr)
	if err != nil {
		return NewRoute()
	}
	return route
}

func parseRoutes(jsonStr string) []Route {
	routes, err := ParseJSON[[]Route](jsonStr)
	if err != nil {
		return []Route{}
	}
	return routes
}
