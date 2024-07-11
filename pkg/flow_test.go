package pkg

import (
	"testing"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/stretchr/testify/assert"
)

func TestGetRoute(t *testing.T) {
	savedFlowModel := db.SavedFlowModel{}
	route := getRoute(savedFlowModel.MainRoute)

	assert.False(t, route.IsActive)

	assert.NotEqual(t, route.LogicalRelation, "")

	assert.NotNil(t, route.Rules)
	assert.Len(t, route.Rules, 0)

	assert.NotNil(t, route.Paths)
	assert.Len(t, route.Paths, 0)
}

func TestGetRoutes(t *testing.T) {
	savedFlowModel := db.SavedFlowModel{}
	routes := getRoutes(savedFlowModel.RuleRoutes)

	assert.NotNil(t, routes)
	assert.Len(t, routes, 0)
}

func TestMakeInitializedRoute(t *testing.T) {
	route := newInitializedRoute()

	assert.False(t, route.IsActive)

	assert.NotEqual(t, route.LogicalRelation, "")

	assert.NotNil(t, route.Rules)
	assert.Len(t, route.Rules, 0)

	assert.NotNil(t, route.Paths)
	assert.Len(t, route.Paths, 0)
}
