package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseNamedTokens(t *testing.T) {
	assert.NotNil(t, parseNamedTokens(""))
	assert.Len(t, parseNamedTokens(""), 0)

	assert.NotNil(t, parseNamedTokens("{}"))
	assert.Len(t, parseNamedTokens("{}"), 0)

	assert.NotNil(t, parseNamedTokens("[]"))
	assert.Len(t, parseNamedTokens("[]"), 0)

	// Testing invalid JSON string
	assert.NotNil(t, parseNamedTokens("{"))
	assert.Len(t, parseNamedTokens("{"), 0)
}
