package pkg

import (
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReplaceTokensInURL(t *testing.T) {
	var (
		initialURL = "https://bing.com?city=" + URLTokenMatcherCity + "&isp=" + URLTokenMatcherIsp
		finalURL   = "https://bing.com?city=Atlanta&isp=" + url.QueryEscape("AS6SB9 Telenor A/S")
	)

	click := Click{
		City: "Atlanta",
		Isp:  "AS6SB9 Telenor A/S",
	}

	destOpts := DestinationOpts{
		IpInfoData: IPInfoData{
			City: "Atlanta",
			Org:  "AS6SB9 Telenor A/S",
		},
	}

	t.Run("Test replace query params", func(t *testing.T) {
		assert.Equal(t, ReplaceTokensInURL(initialURL, click.TokenMatcherMap()), finalURL)
		assert.Equal(t, ReplaceTokensInURL(initialURL, destOpts.TokenMatcherMap()), finalURL)
	})

	t.Run("Test with invalid query params", func(t *testing.T) {
		var (
			initialURL = initialURL + "&invalid=true&not=needed"
			finalURL   = finalURL + "&invalid=true&not=needed"
		)

		assert.Equal(t, ReplaceTokensInURL(initialURL, click.TokenMatcherMap()), finalURL)
		assert.Equal(t, ReplaceTokensInURL(initialURL, destOpts.TokenMatcherMap()), finalURL)
	})

	t.Run("Test with empty string query params", func(t *testing.T) {
		var (
			initialURL = initialURL + "&empty=&novalue="
			finalURL   = finalURL + "&empty=&novalue="
		)

		assert.Equal(t, ReplaceTokensInURL(initialURL, click.TokenMatcherMap()), finalURL)
		assert.Equal(t, ReplaceTokensInURL(initialURL, destOpts.TokenMatcherMap()), finalURL)
	})
}
