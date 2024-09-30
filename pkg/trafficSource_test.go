package pkg

import (
	"net/url"
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

func TestGetCost(t *testing.T) {
	ts := TrafficSource{
		CostToken: Token{
			QueryParam: "cost",
		},
	}

	t.Run("Test integer cost", func(t *testing.T) {
		assert.Equal(t, float64(12), ts.GetCost(
			url.URL{
				RawQuery: "cost=12",
			},
		))
		assert.Equal(t, float64(12), ts.GetCost(
			url.URL{
				RawQuery: "cost=12.0",
			},
		))
		assert.Equal(t, float64(12), ts.GetCost(
			url.URL{
				RawQuery: "cost=12.00000",
			},
		))
	})

	t.Run("Test decimal cost", func(t *testing.T) {
		assert.Equal(t, float64(12.56789), ts.GetCost(
			url.URL{
				RawQuery: "cost=12.56789",
			},
		))
		assert.Equal(t, float64(12.56789), ts.GetCost(
			url.URL{
				RawQuery: "cost=12.567890",
			},
		))
		assert.Equal(t, float64(12.56789), ts.GetCost(
			url.URL{
				RawQuery: "cost=12.5678900000",
			},
		))
	})
}
