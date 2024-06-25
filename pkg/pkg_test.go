package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFetchIpInfo(t *testing.T) {
	ipInfo1, err := FetchIpInfo("", "")
	assert.Nil(t, ipInfo1)
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), emptyStringError)

	ipInfo2, err := FetchIpInfo("12.34.567.8", "")
	assert.Nil(t, ipInfo2)
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), emptyStringError)

	ipInfo3, err := FetchIpInfo("", "myipinfotoken")
	assert.Nil(t, ipInfo3)
	assert.NotNil(t, err)
}

func TestIpBlacklist(t *testing.T) {
	// Having an empty string on the blacklist was causing the regex to return a false positive
	assert.False(t, sliceIncludes(ipBlacklist, ""))
}
