package pkg

import (
	"net/http"
	"os"
)

const defaultCatchAllRedirectUrl = "https://bing.com"

func RedirectVisitor(w http.ResponseWriter, r *http.Request, url string) {
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func RedirectToCatchAllUrl(w http.ResponseWriter, r *http.Request) {
	RedirectVisitor(w, r, CatchAllUrl())
}

func CatchAllUrl() string {
	catchAllUrl := os.Getenv(EnvCatchAllRedirectUrl)
	if catchAllUrl == "" {
		return defaultCatchAllRedirectUrl
	}
	return catchAllUrl
}

func catchAllDest() Destination {
	return Destination{
		Type: DestTypeCatchAll,
		URL:  CatchAllUrl(),
	}
}
