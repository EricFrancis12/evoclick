package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSliceIncludes(t *testing.T) {
	strSlice := []string{"a", "b", "c"}
	assert.True(t, sliceIncludes(strSlice, "b"))
	assert.False(t, sliceIncludes(strSlice, "d"))

	intSlice := []int{1, 2, 3}
	assert.True(t, sliceIncludes(intSlice, 2))
	assert.False(t, sliceIncludes(intSlice, 4))

	boolSlice := []bool{true, true}
	assert.True(t, sliceIncludes(boolSlice, true))
	assert.False(t, sliceIncludes(boolSlice, false))
}

func TestMatchValAgainstRegexSlice(t *testing.T) {
	isMatch, err := matchValAgainstRegexSlice([]string{"[::1]*"}, "[::1]12345")
	assert.Nil(t, err)
	assert.True(t, isMatch)

	isMatch, __err := matchValAgainstRegexSlice([]string{""}, "[::1]12345")
	assert.Nil(t, __err)
	assert.True(t, isMatch)

	isMatch, _err := matchValAgainstRegexSlice([]string{}, "[::1]12345")
	assert.Nil(t, _err)
	assert.False(t, isMatch)
}
