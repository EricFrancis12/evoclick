package pkg

import (
	"context"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllOffers(ctx context.Context) ([]Offer, error) {
	models, err := s.Client.Offer.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatOffers(models), nil
}

func (s *Storer) GetOfferById(ctx context.Context, id int) (*Offer, error) {
	model, err := s.Client.Offer.FindUnique(
		db.Offer.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatOffer(model), nil
}

func formatOffer(model *db.OfferModel) *Offer {
	return &Offer{
		InnerOffer: model.InnerOffer,
	}
}

func formatOffers(models []db.OfferModel) []Offer {
	var offers []Offer
	for _, model := range models {
		o := formatOffer(&model)
		offers = append(offers, *o)
	}
	return offers
}
