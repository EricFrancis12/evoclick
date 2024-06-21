package pkg

import (
	"context"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

func (s *Storer) GetAllLandingPages(ctx context.Context) ([]LandingPage, error) {
	models, err := s.Client.LandingPage.FindMany().Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatLandingPages(models), nil
}

func (s *Storer) GetLandingPageById(ctx context.Context, id int) (*LandingPage, error) {
	model, err := s.Client.LandingPage.FindUnique(
		db.LandingPage.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return formatLandingPage(model), nil
}

func formatLandingPage(model *db.LandingPageModel) *LandingPage {
	return &LandingPage{
		InnerLandingPage: model.InnerLandingPage,
	}
}

func formatLandingPages(models []db.LandingPageModel) []LandingPage {
	var landingPages []LandingPage
	for _, model := range models {
		lp := formatLandingPage(&model)
		landingPages = append(landingPages, *lp)
	}
	return landingPages
}
