package pkg

import (
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
