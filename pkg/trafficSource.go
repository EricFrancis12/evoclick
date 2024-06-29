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

	// If we fetch from the db successfully, create a new key for this traffic source in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, ts)

	return ts, nil
}

func (ts TrafficSource) FillPostbackURL(click Click) string {
	if ts.PostbackURL == "" {
		return ""
	}

	clickPropsMap := map[string]string{
		"{ID}":                 strconv.Itoa(click.ID),
		"{publicID}":           click.PublicID,
		"{externalID}":         click.ExternalID,
		"{cost}":               strconv.Itoa(click.Cost),
		"{revenue}":            strconv.Itoa(click.Revenue),
		"{viewTime}":           timeString(click.ViewTime),
		"{clickTime}":          timeString(click.ClickTime),
		"{convTime}":           timeString(click.ConvTime),
		"{viewOutputUrl}":      click.ViewOutputURL,
		"{clickOutputUrl}":     click.ClickOutputURL,
		"{ip}":                 click.IP,
		"{isp}":                click.Isp,
		"{userAgent}":          click.UserAgent,
		"{language}":           click.Language,
		"{country}":            click.Country,
		"{region}":             click.Region,
		"{city}":               click.City,
		"{deviceType}":         click.DeviceType,
		"{device}":             click.Device,
		"{screenResolution}":   click.ScreenResolution,
		"{os}":                 click.Os,
		"{osVersion}":          click.OsVersion,
		"{browserName}":        click.BrowserName,
		"{browserVersion}":     click.BrowserVersion,
		"{createdAt}":          timeString(click.CreatedAt),
		"{updatedAt}":          timeString(click.UpdatedAt),
		"{affiliateNetworkId}": strconv.Itoa(click.AffiliateNetworkID),
		"{campaignId}":         strconv.Itoa(click.CampaignID),
		"{flowId}":             strconv.Itoa(click.FlowID),
		"{landingPageId}":      strconv.Itoa(click.LandingPageID),
		"{offerId}":            strconv.Itoa(click.OfferID),
		"{trafficSourceId}":    strconv.Itoa(click.TrafficSourceID),
	}

	result := ts.PostbackURL
	for matcher, clickProp := range clickPropsMap {
		if strings.Contains(result, matcher) {
			result = strings.ReplaceAll(result, matcher, clickProp)
		}
	}
	return result
}

func formatTrafficSource(model *db.TrafficSourceModel) TrafficSource {
	var (
		externalIDToken = parseToken(model.ExternalIDToken)
		costToken       = parseToken(model.CostToken)
		customTokens    = parseNamedTokens(model.CustomTokens)
	)
	return TrafficSource{
		InnerTrafficSource: model.InnerTrafficSource,
		ExternalIDToken:    externalIDToken,
		CostToken:          costToken,
		CustomTokens:       customTokens,
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
