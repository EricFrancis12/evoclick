package pkg

import (
	"net/url"
	"strings"
)

type URLTokenMatcherMap = map[URLTokenMatcher]string

func ReplaceTokensInURL(_url string, urltmm URLTokenMatcherMap) string {
	for matcher, clickProp := range urltmm {
		if strings.Contains(_url, matcher) {
			_url = strings.ReplaceAll(_url, matcher, url.QueryEscape(clickProp))
		}
	}
	return _url
}
