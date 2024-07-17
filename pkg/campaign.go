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
	key := s.MakeRedisKeyFunc("campaign")(strconv.Itoa(id))
	// Check redis cache for this campaign
	campaign, err := CheckRedisForKey[Campaign](s.Cache, ctx, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return campaign, nil
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
	defer s.SaveKeyToRedis(ctx, key, c)

	return c, nil
}

func (s *Storer) GetCampaignByPublicId(ctx context.Context, publicId string) (Campaign, error) {
	// Create a Redis key to store the campaign at its public id
	publicIdKey := s.MakeRedisKeyFunc("campaign@publicId")(publicId)

	// Check redis cache for this campaign
	campaign, err := CheckRedisForKey[Campaign](s.Cache, ctx, publicIdKey)
	if err != nil {
		fmt.Println(err)
	} else {
		return campaign, nil
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
	defer s.SaveKeyToRedis(ctx, publicIdKey, c)

	// Create a Redis key to store the campaign normally at its id
	idKey := s.MakeRedisKeyFunc("campaign")(strconv.Itoa(c.ID))
	// Set a new key for this campaign in the cache
	defer s.SaveKeyToRedis(ctx, idKey, c)

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

func (c *Campaign) SelectLandingPageID(ids []int) (int, error) {
	return selectIDUsingRotType(ids, c.LandingPageRotationType)
}

func (c *Campaign) SelectOfferID(ids []int) (int, error) {
	return selectIDUsingRotType(ids, c.OfferRotationType)
}

func (c *Campaign) DetermineViewDestination(r *http.Request, ctx context.Context, storer Storer, savedFlow SavedFlow, userAgent useragent.UserAgent, ipInfoData IPInfoData) (Destination, error) {
	if c.FlowType == db.FlowTypeURL && c.FlowURL != nil && *c.FlowURL != "" {
		return Destination{
			Type: DestTypeURL,
			URL:  *c.FlowURL,
		}, nil
	} else if c.FlowType == db.FlowTypeBuiltIn || c.FlowType == db.FlowTypeSaved {
		route := Route{}
		if c.FlowType == db.FlowTypeBuiltIn {
			route = c.SelectViewRoute(r, userAgent, ipInfoData)
		} else {
			route = savedFlow.SelectViewRoute(r, userAgent, ipInfoData)
		}

		path, err := route.WeightedSelectPath()
		if err != nil {
			return catchAllDest(), err
		}

		if !path.DirectLinkingEnabled {
			lpID, err := c.SelectOfferID(path.LandingPageIDs)
			if err != nil {
				return catchAllDest(), err
			}

			lp, err := storer.GetLandingPageById(ctx, lpID)
			if err != nil {
				return catchAllDest(), err
			}

			return Destination{
				Type: DestTypeLandingPage,
				URL:  lp.URL,
				ID:   lp.ID,
			}, nil
		} else {
			oID, err := c.SelectOfferID(path.OfferIDs)
			if err != nil {
				return catchAllDest(), err
			}

			o, err := storer.GetOfferById(ctx, oID)
			if err != nil {
				return catchAllDest(), err
			}

			return Destination{
				Type: DestTypeOffer,
				URL:  o.URL,
				ID:   o.ID,
			}, nil
		}
	}
	return catchAllDest(), fmt.Errorf("missing or unknown flow type")
}

func selectIDUsingRotType(ids []int, rotType db.RotationType) (int, error) {
	if len(ids) == 0 {
		return 0, fmt.Errorf("ids slice is empty")
	}
	if rotType == db.RotationTypeRandom {
		return RandomItem(ids)
	} else {
		return 0, fmt.Errorf("unknown rotation type: " + string(rotType))
	}
}

func formatCampaign(model *db.CampaignModel) Campaign {
	campaign := Campaign{
		InnerCampaign:  model.InnerCampaign,
		FlowMainRoute:  NewRoute(),
		FlowRuleRoutes: []Route{},
	}

	flowMainRouteStr, ok := model.FlowMainRoute()
	if ok {
		campaign.FlowMainRoute = parseRoute(flowMainRouteStr)
	}

	flowRuleRoutesStr, ok := model.FlowRuleRoutes()
	if ok {
		campaign.FlowRuleRoutes = parseRoutes(flowRuleRoutesStr)
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
