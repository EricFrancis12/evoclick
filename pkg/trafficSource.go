package pkg

import (
	"context"
	"fmt"

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
	var (
		defaultTokens = parseTokens(model.DefaultTokens)
		customTokens  = parseTokens(model.CustomTokens)
	)
	return &TrafficSource{
		InnerTrafficSource: model.InnerTrafficSource,
		DefaultTokens:      defaultTokens,
		CustomTokens:       customTokens,
	}
}

func formatTrafficSources(models []db.TrafficSourceModel) []TrafficSource {
	var trafficSources []TrafficSource
	for _, model := range models {
		ts := formatTrafficSource(&model)
		trafficSources = append(trafficSources, *ts)
	}
	return trafficSources
}

func parseTokens(jsonStr string) []Token {
	tokens, err := parseJSON[[]Token](jsonStr)
	if err != nil {
		fmt.Printf("Error parsing Tokens: %s", err)
		return []Token{}
	}
	return tokens
}
