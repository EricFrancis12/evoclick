package pkg

import (
	"testing"

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
