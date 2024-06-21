package pkg

import (
	"context"

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
	model, err := s.Client.Campaign.FindUnique(
		db.Campaign.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatCampaign(model), nil
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
