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
func TestParseJSON(t *testing.T) {
	type Person struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
	}

	jsonStr := `{"name": "John", "age": 30}`
	expectedMap := map[string]interface{}{"name": "John", "age": float64(30)}

	resultMap, err := ParseJSON[map[string]interface{}](jsonStr)
	assert.NoError(t, err)
	assert.Equal(t, expectedMap, resultMap)

	expectedStruct := Person{Name: "John", Age: 30}

	resultStruct, err := ParseJSON[Person](jsonStr)
	assert.NoError(t, err)
	assert.Equal(t, expectedStruct, resultStruct)

	invalidJsonStr := `{"name": "John", "age": 30`

	var expectedInvalidMap map[string]interface{}

	resultInvalidMap, err := ParseJSON[map[string]interface{}](invalidJsonStr)
	assert.Error(t, err)
	assert.Equal(t, expectedInvalidMap, resultInvalidMap)

	jsonStrSlice := `["apple", "banana", "cherry"]`
	expectedSlice := []string{"apple", "banana", "cherry"}

	resultSlice, err := ParseJSON[[]string](jsonStrSlice)
	assert.NoError(t, err)
	assert.Equal(t, expectedSlice, resultSlice)

	jsonStrInt := `123`
	expectedInt := 123

	resultInt, err := ParseJSON[int](jsonStrInt)
	assert.NoError(t, err)
	assert.Equal(t, expectedInt, resultInt)

	emptyJsonStr := ``
	var expectedEmptyMap map[string]interface{}

	resultEmptyMap, err := ParseJSON[map[string]interface{}](emptyJsonStr)
	assert.Error(t, err)
	assert.Equal(t, expectedEmptyMap, resultEmptyMap)
}
