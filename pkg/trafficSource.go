package pkg

import (
	"context"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllTrafficSources(ctx context.Context) ([]TrafficSource, error) {
	models, err := s.Client.TrafficSource.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatTrafficSources(models), nil
}

func (s *Storer) GetTrafficSourceById(ctx context.Context, id int) (*TrafficSource, error) {
	model, err := s.Client.TrafficSource.FindUnique(
		db.TrafficSource.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatTrafficSource(model), nil
}

func formatTrafficSource(model *db.TrafficSourceModel) *TrafficSource {
	var ts = &TrafficSource{
		InnerTrafficSource: model.InnerTrafficSource,
	}
	parseJSON(model.DefaultTokens, ts.DefaultTokens)
	parseJSON(model.CustomTokens, ts.CustomTokens)
	return ts
}

func formatTrafficSources(models []db.TrafficSourceModel) []TrafficSource {
	var trafficSources []TrafficSource
	for _, model := range models {
		ts := formatTrafficSource(&model)
		trafficSources = append(trafficSources, *ts)
	}
	return trafficSources
}
