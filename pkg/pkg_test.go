package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFetchIpInfo(t *testing.T) {
	ipInfo1, err := FetchIpInfo("", "")
	assert.Equal(t, ipInfo1.Country, "")
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), emptyStringError)

	ipInfo2, err := FetchIpInfo("12.34.567.8", "")
	assert.Equal(t, ipInfo2.Country, "")
	assert.NotNil(t, err)
	assert.Equal(t, err.Error(), emptyStringError)

	ipInfo3, err := FetchIpInfo("", "myipinfotoken")
	assert.Equal(t, ipInfo3.Country, "")
	assert.NotNil(t, err)
}

func TestIpBlacklist(t *testing.T) {
	// Having an empty string on the blacklist was causing the regex to return a false positive
	assert.False(t, sliceIncludes(ipBlacklist, ""))
}
