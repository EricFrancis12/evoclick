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
