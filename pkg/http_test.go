package pkg

import (
	"net/http"
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFetchIpInfo(t *testing.T) {
	cc := NewCustomHTTPClient()

	ipInfo1, err := cc.FetchIpInfoData("", "")
	assert.Equal(t, ipInfo1.Country, "")
	assert.NotNil(t, err)

	ipInfo2, err := cc.FetchIpInfoData("12.34.567.8", "")
	assert.Equal(t, ipInfo2.Country, "")
	assert.NotNil(t, err)

	ipInfo3, err := cc.FetchIpInfoData("", "myipinfotoken")
	assert.Equal(t, ipInfo3.Country, "")
	assert.NotNil(t, err)
}

func TestGetLanguage(t *testing.T) {
	var langStrs = []string{
		"en",
		"En",
		"EN",
		"en-us",
		"En-us",
		"EN-us",
		"en-US,en;q=0.5",
		"en-US,en;q=0.9",
		"en,es;q=0.9",
		"en-US,en;q=0.9,es;q=0.8",
		"en-US,en",
		"en-US,en;q=0.9,pt;q=0.8",
		"en-US,en;q=0.9,sw;q=0.8",
		"en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
		"en-NI,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6",
	}

	for _, langStr := range langStrs {
		assert.Equal(t, "en", GetLanguage(http.Request{
			Header: http.Header{
				"Accept-Language": []string{langStr},
			},
		}))
	}
}

func TestGetPid(t *testing.T) {
	t.Run("Test missing or empty pid", func(t *testing.T) {
		assert.Equal(t, "", GetPid(url.URL{}))
		assert.Equal(t, "", GetPid(url.URL{
			RawQuery: string(QueryParamPid) + "=",
		}))
	})

	t.Run("Test correct usage of pid", func(t *testing.T) {
		assert.Equal(t, "1234", GetPid(url.URL{
			RawQuery: string(QueryParamPid) + "=" + "1234",
		}))
		assert.Equal(t, "1234-5678-90", GetPid(url.URL{
			RawQuery: string(QueryParamPid) + "=" + "1234-5678-90",
		}))
		assert.Equal(t, "1234_5678_90", GetPid(url.URL{
			RawQuery: string(QueryParamPid) + "=" + "1234_5678_90",
		}))
		assert.Equal(t, "1234-5678_90", GetPid(url.URL{
			RawQuery: string(QueryParamPid) + "=" + "1234-5678_90",
		}))
	})
}

func TestGetRevenue(t *testing.T) {
	t.Run("Test missing or empty payout", func(t *testing.T) {
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=",
			},
		))
	})

	t.Run("Test invalid payout", func(t *testing.T) {
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=INVALID",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=NOT_A_NUMBER",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=-",
			},
		))
	})

	t.Run("Test negative payout", func(t *testing.T) {
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=-0",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=-12",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=-12.5",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=-12.56789",
			},
		))
		assert.Equal(t, float64(0), GetRevenue(
			url.URL{
				RawQuery: "payout=-12.50000",
			},
		))
	})

	t.Run("Test integer payout", func(t *testing.T) {
		assert.Equal(t, float64(12), GetRevenue(
			url.URL{
				RawQuery: "payout=12",
			},
		))
		assert.Equal(t, float64(12), GetRevenue(
			url.URL{
				RawQuery: "payout=12.0",
			},
		))
		assert.Equal(t, float64(12), GetRevenue(
			url.URL{
				RawQuery: "payout=12.00000",
			},
		))
	})

	t.Run("Test decimal payout", func(t *testing.T) {
		assert.Equal(t, float64(12.56789), GetRevenue(
			url.URL{
				RawQuery: "payout=12.56789",
			},
		))
		assert.Equal(t, float64(12.56789), GetRevenue(
			url.URL{
				RawQuery: "payout=12.567890",
			},
		))
		assert.Equal(t, float64(12.56789), GetRevenue(
			url.URL{
				RawQuery: "payout=12.5678900000",
			},
		))
	})
}
