package pkg

// func (s *Storer) UpdateLandingPageById(
// 	ctx context.Context,
// 	id int,
// 	_name db.LandingPageWithPrismaNameSetParam,
// 	params ...db.LandingPageSetParam,
// ) (*LandingPage, error) {
// 	model, err := s.Client.LandingPage.UpsertOne(
// 		db.LandingPage.ID.Equals(id),
// 	).Create(
// 		_name,
// 		params...,
// 	).Update(
// 		params...,
// 	).Exec(ctx)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return formatLandingPage(model), nil
// }
