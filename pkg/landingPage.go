package pkg

import (
	"context"
	"fmt"
	"strconv"

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
	key := InitMakeRedisKey("landingPage")(strconv.Itoa(id))
	// Check redis cache for this landing page
	landingPage, err := CheckRedisForKey[LandingPage](ctx, s.Cache, key)
	if err != nil {
		fmt.Println(err)
	} else {
		return landingPage, nil
	}

	// If not in cache, query db for it
	model, err := s.Client.LandingPage.FindUnique(
		db.LandingPage.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	lp := formatLandingPage(model)

	// If we fetch from the db successfully, create a new key for this landing page in the cache
	defer SaveKeyToRedis(ctx, s.Cache, key, lp)

	return lp, nil
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
