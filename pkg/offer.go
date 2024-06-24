package pkg

import (
	"context"
	"fmt"
	"strconv"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllOffers(ctx context.Context) ([]Offer, error) {
	models, err := s.Client.Offer.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatOffers(models), nil
}

func (s *Storer) GetOfferById(ctx context.Context, id int) (Offer, error) {
	key := InitMakeRedisKey("offer")(strconv.Itoa(id))
	// Check redis cache for this offer
	offer, err := CheckRedisForKey[Offer](ctx, s.Cache, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return *offer, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.Offer.FindUnique(
		db.Offer.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return Offer{}, err
	}

	o := formatOffer(model)

	// If we fetch from the db successfully, create a new key for this offer in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, o)

	return o, nil
}

func formatOffer(model *db.OfferModel) Offer {
	return Offer{
		InnerOffer: model.InnerOffer,
	}
}

func formatOffers(models []db.OfferModel) []Offer {
	var offers []Offer
	for _, model := range models {
		o := formatOffer(&model)
		offers = append(offers, o)
	}
	return offers
}
