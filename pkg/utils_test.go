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
	t.Run("Parse JSON into map", func(t *testing.T) {
		jsonStr := `{"name": "John", "age": 30}`
		expected := map[string]interface{}{"name": "John", "age": float64(30)}

		result, err := ParseJSON[map[string]interface{}](jsonStr)
		assert.NoError(t, err)
		assert.Equal(t, expected, result)
	})

	t.Run("Parse JSON into struct", func(t *testing.T) {
		type Person struct {
			Name string `json:"name"`
			Age  int    `json:"age"`
		}

		jsonStr := `{"name": "John", "age": 30}`
		expected := Person{Name: "John", Age: 30}

		result, err := ParseJSON[Person](jsonStr)
		assert.NoError(t, err)
		assert.Equal(t, expected, result)
	})

	t.Run("Parse invalid JSON", func(t *testing.T) {
		jsonStr := `{"name": "John", "age": 30`

		var expected map[string]interface{}

		result, err := ParseJSON[map[string]interface{}](jsonStr)
		assert.Error(t, err)
		assert.Equal(t, expected, result)
	})

	t.Run("Parse JSON into slice", func(t *testing.T) {
		jsonStr := `["apple", "banana", "cherry"]`
		expected := []string{"apple", "banana", "cherry"}

		result, err := ParseJSON[[]string](jsonStr)
		assert.NoError(t, err)
		assert.Equal(t, expected, result)
	})

	t.Run("Parse JSON into int", func(t *testing.T) {
		jsonStr := `123`
		expected := 123

		result, err := ParseJSON[int](jsonStr)
		assert.NoError(t, err)
		assert.Equal(t, expected, result)
	})

	t.Run("Parse empty JSON string", func(t *testing.T) {
		jsonStr := ``
		var expected map[string]interface{}

		result, err := ParseJSON[map[string]interface{}](jsonStr)
		assert.Error(t, err)
		assert.Equal(t, expected, result)
	})
}
