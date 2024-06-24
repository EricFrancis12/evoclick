package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFetchIpInfo(t *testing.T) {
	emptyStr := ""
	ipInfo1, err := FetchIpInfo(emptyStr, "")
	assert.Nil(t, ipInfo1)
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), ipInfoTokenMissingErr)

	ipAddr := "12.34.567.8"
	ipInfo2, err := FetchIpInfo(ipAddr, "")
	assert.Nil(t, ipInfo2)
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), ipInfoTokenMissingErr)

	ipInfo3, err := FetchIpInfo(emptyStr, "myipinfotoken")
	assert.Nil(t, ipInfo3)
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), makeBlacklistErr(emptyStr))
}
