package pkg

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseJSON(t *testing.T) {
	t.Run("Parse JSON into map", func(t *testing.T) {
		jsonStr := `{"name": "John", "age": 30}`
		var expected map[string]interface{}
		expected = map[string]interface{}{"name": "John", "age": float64(30)}

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
