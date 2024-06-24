package pkg

import (
	"fmt"
	"math/rand"
	"regexp"
	"time"
)

func sliceIncludes[T string | int | bool](slice []T, val T) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

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

func FilterSlice[T any](slice []T, predicate func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if predicate(v) {
			result = append(result, v)
		}
	}
	return result
}

func RandomItem[T any](items []T) (T, error) {
	if len(items) == 0 {
		var zeroValue T
		return zeroValue, fmt.Errorf("slice is empty")
	}

	rand.Seed(time.Now().UnixNano())
	randomIndex := rand.Intn(len(items))
	return items[randomIndex], nil
}
