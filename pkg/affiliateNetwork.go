package pkg

import (
	"context"
	"fmt"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllAffiliateNetworks(ctx context.Context) ([]AffiliateNetwork, error) {
	models, err := s.Client.AffiliateNetwork.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatAffiliateNetworks(models), nil
}

func (s *Storer) GetAffiliateNetworkById(ctx context.Context, id int) (AffiliateNetwork, error) {
	key := s.MakeRedisKeyFunc("affiliateNetwork")(strconv.Itoa(id))
	// Check redis cache for this affiliate network
	affiliateNetwork, err := CheckRedisForKey[AffiliateNetwork](s.Cache, ctx, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return affiliateNetwork, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.AffiliateNetwork.FindUnique(
		db.AffiliateNetwork.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return AffiliateNetwork{}, err
	}

	an := formatAffiliateNetwork(model)

	// If we fetch from the db successfully, create a new key for this affiliate network in the cache
	defer s.SaveKeyToRedis(ctx, key, an)

	return an, nil
}

func formatAffiliateNetwork(model *db.AffiliateNetworkModel) AffiliateNetwork {
	return AffiliateNetwork{
		InnerAffiliateNetwork: model.InnerAffiliateNetwork,
	}
}

func formatAffiliateNetworks(models []db.AffiliateNetworkModel) []AffiliateNetwork {
	var affiliateNetwork []AffiliateNetwork
	for _, model := range models {
		an := formatAffiliateNetwork(&model)
		affiliateNetwork = append(affiliateNetwork, an)
	}
	return affiliateNetwork
}
