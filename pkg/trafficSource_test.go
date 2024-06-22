package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseTokens(t *testing.T) {
	assert.NotNil(t, parseTokens(""))
	assert.Len(t, parseTokens(""), 0)

	assert.NotNil(t, parseTokens("{}"))
	assert.Len(t, parseTokens("{}"), 0)

	assert.NotNil(t, parseTokens("[]"))
	assert.Len(t, parseTokens("[]"), 0)

	// Testing invalid JSON string
	assert.NotNil(t, parseTokens("{"))
	assert.Len(t, parseTokens("{"), 0)
}
