package pkg

import (
	"net/http"
	"os"

	"github.com/mileusna/useragent"
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

func GetDeviceType(ua useragent.UserAgent) DeviceType {
	if ua.Desktop {
		return DeviceTypeDesktop
	} else if ua.Tablet {
		return DeviceTypeTablet
	} else if ua.Mobile {
		return DeviceTypeMobile
	}
	return DeviceTypeUnknown
}

func GetLanguage(r *http.Request) string {
	return r.Header.Get("Accept-Language")
}

func GetScreenRes(r *http.Request) string {
	return r.Header.Get("Viewport-Width")
}
