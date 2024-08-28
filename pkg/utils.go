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
func SliceIncludes[C comparable](slice []C, val C) bool {
	for _, c := range slice {
		if c == val {
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
		ok, err := regexp.Match(regex, []byte(val))
		if err != nil {
			return false, err
		}
		if ok {
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
	for _, t := range slice {
		if predicate(t) {
			result = append(result, t)
		}
	}
	return result
}

// Returns the string at index 0 in a slice of strings,
// or an empty string if the slice is empty
func SafeFirstString(strings []string) string {
	if len(strings) > 0 {
		return strings[0]
	}
	return ""
}

// Returns a random item from the provided slice.
func RandomItem[T any](items []T) (T, error) {
	if len(items) == 0 {
		var zeroValue T
		return zeroValue, fmt.Errorf("slice is empty")
	}
	randomIndex := RandomInt(len(items))
	return items[randomIndex], nil
}

func RandomInt(n int) int {
	source := rand.NewSource(time.Now().UnixNano())
	random := rand.New(source)
	return random.Intn(n)
}
