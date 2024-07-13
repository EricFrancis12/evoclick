package pkg

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
)

func (s *Storer) GetAllCampaigns(ctx context.Context) ([]Campaign, error) {
	models, err := s.Client.Campaign.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatCampaigns(models), nil
}

func (s *Storer) GetCampaignById(ctx context.Context, id int) (Campaign, error) {
	key := InitMakeRedisKey("campaign")(strconv.Itoa(id))
	// Check redis cache for this campaign
	campaign, err := CheckRedisForKey[Campaign](ctx, s.Cache, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return *campaign, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.Campaign.FindUnique(
		db.Campaign.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return Campaign{}, err
	}

	c := formatCampaign(model)

	// If we fetch from the db successfully, create a new key for this campaign in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, c)

	return c, nil
}

func (s *Storer) GetCampaignByPublicId(ctx context.Context, publicId string) (Campaign, error) {
	// Create a Redis key to store the campaign at its public id
	publicIdKey := InitMakeRedisKey("campaign@publicId")(publicId)

	// Check redis cache for this campaign
	campaign, err := CheckRedisForKey[Campaign](ctx, s.Cache, publicIdKey)
	if err != nil {
		fmt.Println(err)
	} else {
		return *campaign, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.Campaign.FindUnique(
		db.Campaign.PublicID.Equals(publicId),
	).Exec(ctx)
	if err != nil {
		return Campaign{}, err
	}

	c := formatCampaign(model)

	// If we fetch from the db successfully, set a new key for this campaign@publicId in the cache
	defer SaveKeyToRedis(ctx, s.Cache, publicIdKey, c)

	// Create a Redis key to store the campaign normally at its id
	idKey := InitMakeRedisKey("campaign")(strconv.Itoa(c.ID))
	// Set a new key for this campaign in the cache
	defer SaveKeyToRedis(ctx, s.Cache, idKey, c)

	return c, nil
}

func (c *Campaign) SelectViewRoute(r *http.Request, userAgent useragent.UserAgent, ipInfoData IPInfoData) Route {
	return selectViewRoute(c.FlowMainRoute, c.FlowRuleRoutes, r, userAgent, ipInfoData)
}

// Checks if the click triggered any rule routes, and if not returns the main route
func (c *Campaign) SelectClickRoute(click Click) Route {
	return selectClickRoute(c.FlowMainRoute, c.FlowRuleRoutes, click)
}

func (c *Campaign) IpInfoNeeded() bool {
	return IpInfoNeeded(c.FlowRuleRoutes)
}

func formatCampaign(model *db.CampaignModel) Campaign {
	campaign := Campaign{
		InnerCampaign:  model.InnerCampaign,
		FlowMainRoute:  newInitializedRoute(),
		FlowRuleRoutes: []Route{},
	}

	flowMainRouteStr, ok := model.FlowMainRoute()
	if ok {
		campaign.FlowMainRoute = getRoute(flowMainRouteStr)
	}

	flowRuleRoutesStr, ok := model.FlowRuleRoutes()
	if ok {
		campaign.FlowRuleRoutes = getRoutes(flowRuleRoutesStr)
	}

	return campaign
}

func formatCampaigns(models []db.CampaignModel) []Campaign {
	var campaign []Campaign
	for _, model := range models {
		c := formatCampaign(&model)
		campaign = append(campaign, c)
	}
	return campaign
}
