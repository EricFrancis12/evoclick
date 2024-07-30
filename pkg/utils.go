package pkg

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"regexp"
	"time"
)

// Unmarshals a JSON string into a variable of the provided type.
func ParseJSON[T any](jsonStr string) (T, error) {
	var v T
	err := json.Unmarshal([]byte(jsonStr), &v)
	if err != nil {
		return v, err
	}
	return v, nil
}

// Checks if a given value is present in the slice.
func SliceIncludes[T string | int | bool](slice []T, val T) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

// Checks if the provided string value matches any
// of the regular expressions in the regex slice. Returns true if there
// is a match and false otherwise. If an error occurs while matching,
// returns false and the error.
func matchValAgainstRegexSlice(regexSlice []string, val string) (bool, error) {
	for _, regex := range regexSlice {
		isMatch, err := regexp.Match(regex, []byte(val))
		if err != nil {
			return false, err
		}
		if isMatch {
			return true, nil
		}
	}
	return false, nil
}

// Filters a slice based on a given predicate function,
// and returns a new slice containing only the elements that satisfy
// the predicate function.
func FilterSlice[T any](slice []T, predicate func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if predicate(v) {
			result = append(result, v)
		}
	}
	return result
}

// Returns the string at index 0 in a slice of strings,
// or an empty string if the slice is empty
func SafeFirstString(strings []string) string {
	str := ""
	if len(strings) > 0 {
		str = strings[0]
	}
	return str
}

// Returns a random item from the provided slice.
func RandomItem[T any](items []T) (T, error) {
	if len(items) == 0 {
		var zeroValue T
		return zeroValue, fmt.Errorf("slice is empty")
	}
	randomIndex := RandomIntn(len(items))
	return items[randomIndex], nil
}

func RandomIntn(n int) int {
	source := rand.NewSource(time.Now().UnixNano())
	random := rand.New(source)
	return random.Intn(n)
}
