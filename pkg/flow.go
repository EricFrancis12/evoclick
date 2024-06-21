package pkg

import (
	"context"
	"fmt"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllFlows(ctx context.Context) ([]Flow, error) {
	models, err := s.Client.Flow.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatFlows(models), nil
}

func (s *Storer) GetFlowById(ctx context.Context, id int) (*Flow, error) {
	model, err := s.Client.Flow.FindUnique(
		db.Flow.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatFlow(model), nil
}

func formatFlow(model *db.FlowModel) *Flow {
	var (
		mainRoute  Route
		ruleRoutes []Route
	)

	if mainRouteStr, ok := model.MainRoute(); !ok {
		fmt.Println("Error parsing Route")
	} else {
		parseJSON(mainRouteStr, mainRoute)
	}

	if ruleRoutesStr, ok := model.RuleRoutes(); !ok {
		fmt.Println("Error parsing Routes")
	} else {
		parseJSON(ruleRoutesStr, ruleRoutes)
	}

	return &Flow{
		InnerFlow:  model.InnerFlow,
		MainRoute:  mainRoute,
		RuleRoutes: ruleRoutes,
	}
}

func formatFlows(models []db.FlowModel) []Flow {
	var flows []Flow
	for _, model := range models {
		fl := formatFlow(&model)
		flows = append(flows, *fl)
	}
	return flows
}
