package pkg

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
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
	key := s.MakeRedisKeyFunc("trafficSource")(strconv.Itoa(id))
	// Check redis cache for this traffic source
	trafficSource, err := CheckRedisForKey[TrafficSource](s.Cache, ctx, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return trafficSource, nil
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
	defer s.SaveKeyToRedis(ctx, key, ts)

	return ts, nil
}

func (ts *TrafficSource) FillPostbackURL(urltmm URLTokenMatcherMap) string {
	if ts.InnerTrafficSource.PostbackURL == nil || *ts.InnerTrafficSource.PostbackURL == "" {
		return ""
	}
	return ReplaceTokensInURL(*ts.InnerTrafficSource.PostbackURL, urltmm)
}

type PostbackResult struct {
	Resp *http.Response
	Err  error
}

func (ts *TrafficSource) SendPostback(click Click, pbrch chan PostbackResult) {
	url := ts.FillPostbackURL(click.TokenMatcherMap())
	if url == "" {
		pbrch <- PostbackResult{
			Resp: &http.Response{},
			Err:  fmt.Errorf("reqest was not made because postback url is an empty string"),
		}
	}

	resp, err := http.Get(url)
	pbrch <- PostbackResult{
		Resp: resp,
		Err:  err,
	}
}

// Itterate over all key/value pairs in the query string,
// creating a Token for them if they are listed as custom tokens on the traffic source
func (ts *TrafficSource) MakeTokens(url url.URL) []Token {
	tokens := []Token{}
	query := url.Query()
	for key, val := range query {
		for _, tstoken := range ts.CustomTokens {
			if key == tstoken.QueryParam {
				tokens = append(tokens, Token{
					QueryParam: key,
					Value:      SafeFirstString(val),
				})
			}
		}
	}
	return tokens
}

func (ts *TrafficSource) GetExternalId(url url.URL) string {
	return url.Query().Get(ts.ExternalIDToken.QueryParam)
}

func (ts *TrafficSource) GetCost(url url.URL) int {
	costStr := url.Query().Get(ts.CostToken.QueryParam)
	cost, err := strconv.Atoi(costStr)
	if err != nil || cost < 0 {
		return 0
	}
	return cost
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
