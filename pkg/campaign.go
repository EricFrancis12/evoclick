package pkg

import (
	"context"
	"fmt"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
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

func formatCampaign(model *db.CampaignModel) Campaign {
	return Campaign{
		InnerCampaign: model.InnerCampaign,
	}
}

func formatCampaigns(models []db.CampaignModel) []Campaign {
	var campaign []Campaign
	for _, model := range models {
		c := formatCampaign(&model)
		campaign = append(campaign, c)
	}
	return campaign
}
