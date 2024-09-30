package pkg

import (
	"net/http"
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
