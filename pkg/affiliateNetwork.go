package pkg

import (
	"context"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllAffiliateNetworks(ctx context.Context) ([]AffiliateNetwork, error) {
	models, err := s.Client.AffiliateNetwork.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatAffiliateNetworks(models), nil
}

func (s *Storer) GetAffiliateNetworkById(ctx context.Context, id int) (*AffiliateNetwork, error) {
	model, err := s.Client.AffiliateNetwork.FindUnique(
		db.AffiliateNetwork.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatAffiliateNetwork(model), nil
}

func formatAffiliateNetwork(model *db.AffiliateNetworkModel) *AffiliateNetwork {
	return &AffiliateNetwork{
		InnerAffiliateNetwork: model.InnerAffiliateNetwork,
	}
}

func formatAffiliateNetworks(models []db.AffiliateNetworkModel) []AffiliateNetwork {
	var affiliateNetwork []AffiliateNetwork
	for _, model := range models {
		an := formatAffiliateNetwork(&model)
		affiliateNetwork = append(affiliateNetwork, *an)
	}
	return affiliateNetwork
}
