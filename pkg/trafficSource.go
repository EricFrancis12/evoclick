package pkg

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllTrafficSources(ctx context.Context) ([]TrafficSource, error) {
	models, err := s.Client.TrafficSource.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatTrafficSources(models), nil
}

func (s *Storer) GetTrafficSourceById(ctx context.Context, id int) (TrafficSource, error) {
	key := InitMakeRedisKey("trafficSource")(strconv.Itoa(id))
	// Check redis cache for this traffic source
	trafficSource, err := CheckRedisForKey[TrafficSource](ctx, s.Cache, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return *trafficSource, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.TrafficSource.FindUnique(
		db.TrafficSource.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return TrafficSource{}, err
	}

	ts := formatTrafficSource(model)

	// If we fetch from the db successfully,
	// create a new key for this traffic source in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, ts)

	return ts, nil
}

func (ts TrafficSource) FillPostbackURL(click Click) string {
	if ts.PostbackURL == "" {
		return ""
	}

	clickPropsMap := newClickPropsMap(click)

	result := ts.PostbackURL
	for matcher, clickProp := range clickPropsMap {
		if strings.Contains(result, matcher) {
			result = strings.ReplaceAll(result, matcher, clickProp)
		}
	}
	return result
}

func formatTrafficSource(model *db.TrafficSourceModel) TrafficSource {
	return TrafficSource{
		InnerTrafficSource: model.InnerTrafficSource,
		ExternalIDToken:    parseToken(model.ExternalIDToken),
		CostToken:          parseToken(model.CostToken),
		CustomTokens:       parseNamedTokens(model.CustomTokens),
	}
}

func formatTrafficSources(models []db.TrafficSourceModel) []TrafficSource {
	var trafficSources []TrafficSource
	for _, model := range models {
		ts := formatTrafficSource(&model)
		trafficSources = append(trafficSources, ts)
	}
	return trafficSources
}

func parseToken(jsonStr string) Token {
	token, err := ParseJSON[Token](jsonStr)
	if err != nil {
		return Token{}
	}
	return token
}

func parseNamedTokens(jsonStr string) []NamedToken {
	tokens, err := ParseJSON[[]NamedToken](jsonStr)
	if err != nil {
		return []NamedToken{}
	}
	return tokens
}

func timeString(t time.Time) string {
	return strings.ReplaceAll(t.String(), " ", "")
}
