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

func (s *Storer) GetCampaignById(ctx context.Context, id int) (*Campaign, error) {
	key := InitMakeRedisKey("campaign")(strconv.Itoa(id))
	// Check redis cache for this campaign
	campaign, err := CheckRedisForKey[Campaign](ctx, s.Cache, key)
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
		return nil, err
	}

	c := formatCampaign(model)

	// If we fetch from the db successfully, create a new key for this campaign in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, c)

	return c, nil
}

func formatCampaign(model *db.CampaignModel) *Campaign {
	return &Campaign{
		InnerCampaign: model.InnerCampaign,
	}
}

func formatCampaigns(models []db.CampaignModel) []Campaign {
	var campaign []Campaign
	for _, model := range models {
		c := formatCampaign(&model)
		campaign = append(campaign, *c)
	}
	return campaign
}
