package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

var makeKey = InitMakeRedisKey("affiliateNetwork")

func (s *Storer) GetAllAffiliateNetworks(ctx context.Context) ([]AffiliateNetwork, error) {
	models, err := s.Client.AffiliateNetwork.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatAffiliateNetworks(models), nil
}

func (s *Storer) GetAffiliateNetworkById(ctx context.Context, id int) (*AffiliateNetwork, error) {
	// Check redis cache for this affiliate network
	key := makeKey(strconv.Itoa(id))
	if s.Cache != nil {
		cachedResult, err := s.Cache.Get(ctx, key).Result()
		if err != nil {
			fmt.Println("error fetching Affiliate Network from cache:", err.Error())
		} else {
			// If found in the cache, parse and return it
			an, err := parseJSON[AffiliateNetwork](cachedResult)
			if err != nil {
				fmt.Println("Error parsing JSON:", err.Error())
			} else {
				return &an, nil
			}
		}
	}

	// If not in cache, query db for it
	model, err := s.Client.AffiliateNetwork.FindUnique(
		db.AffiliateNetwork.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	var an = formatAffiliateNetwork(model)

	// If we fetch from the db successfully, create a new key for this affiliate network in the cache
	defer func() {
		jsonData, err := json.Marshal(an)
		if err != nil {
			fmt.Printf("Error marshalling to JSON: %s", err)
			return
		}
		s.Cache.Set(ctx, key, string(jsonData), 6_000_000_000).Result()
	}()

	return an, nil
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
