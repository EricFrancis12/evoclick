package pkg

import (
	"testing"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/stretchr/testify/assert"
)

func TestParseClickTokens(t *testing.T) {
	assert.NotNil(t, parseClickTokens(""))
	assert.Len(t, parseClickTokens(""), 0)

	assert.NotNil(t, parseClickTokens("{}"))
	assert.Len(t, parseClickTokens("{}"), 0)

	assert.NotNil(t, parseClickTokens("[]"))
	assert.Len(t, parseClickTokens("[]"), 0)

	// Testing invalid JSON string
	assert.NotNil(t, parseClickTokens("{"))
	assert.Len(t, parseClickTokens("{"), 0)
}

func TestAppendIfTrue(t *testing.T) {
	assert.Len(t, appendIfTrue([]db.ClickSetParam{}, db.Click.Country.Set("USA"), true), 1)
	assert.Len(t, appendIfTrue([]db.ClickSetParam{}, db.Click.Country.Set("USA"), false), 0)
}
