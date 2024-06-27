package pkg

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/mileusna/useragent"
)

var HttpClient = NewCustomClient()

type CustomClient struct {
	Client http.Client
}

func NewCustomClient() *CustomClient {
	return &CustomClient{
		Client: http.Client{
			Transport: &customTransport{
				rt: http.DefaultTransport,
			},
		},
	}
}

func (cc *CustomClient) Get(url string) (*http.Response, error) {
	return cc.Client.Get(url)
}

type customTransport struct {
	rt http.RoundTripper
}

var DummyDataMap = map[string]any{
	"ipinfo.io*": IPInfoData{
		IP:       "12.34.567.8",
		Hostname: "any.subdomains.hostname.com",
		City:     "Aarhus",
		Region:   "Central Jutland",
		Country:  "DK",
		Loc:      "95.1567,34.2108",
		Org:      "AS6SB9 Telenor A/S",
		Postal:   "4883",
		Timezone: "Europe/Copenhagen",
	},
}

func (ct *customTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	if os.Getenv("NODE_ENV") == "development" {
		for regex, val := range DummyDataMap {
			b := []byte(req.URL.String())
			if matched, _ := regexp.Match(regex, b); matched {
				log.Println("Responding with dummy data")
				return createJSONResp(val), nil
			}
		}
	}
	return ct.rt.RoundTrip(req)
}

func createJSONResp(v any) *http.Response {
	bytes, _ := json.Marshal(v)
	body := io.NopCloser(strings.NewReader(string(bytes)))
	return &http.Response{
		StatusCode: http.StatusOK,
		Body:       body,
		Header:     make(http.Header),
	}
}

func FetchIpInfo(ipAddr string, ipInfoToken string) (IPInfoData, error) {
	if ipAddr == "" || ipInfoToken == "" {
		return IPInfoData{}, fmt.Errorf(emptyStringError)
	}

	endpoint := "https://ipinfo.io/" + ipAddr + "?token=" + ipInfoToken
	resp, err := HttpClient.Get(endpoint)
	if err != nil {
		return IPInfoData{}, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return IPInfoData{}, err
	}

	ipInfoData, err := ParseJSON[IPInfoData](string(body))
	if err != nil {
		return IPInfoData{}, err
	}

	return ipInfoData, nil
}

const emptyStringError = "ip address and IP Info Token cannot be empty"

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

func ParseJSON[T any](jsonStr string) (T, error) {
	var v T
	if err := json.Unmarshal([]byte(jsonStr), &v); err != nil {
		return v, err
	}
	return v, nil
}

type RedisKeyFunc func(prefix string) string

func InitMakeRedisKey(prefix string) RedisKeyFunc {
	return func(id string) string {
		return prefix + ":" + id
	}
}

func CatchAllUrl(src string) string {
	catchAllUrl := os.Getenv("CATCH_ALL_REDIRECT_URL")
	if catchAllUrl == "" {
		return "https://bing.com?src=" + src
	}
	return catchAllUrl + "?src=" + src
}
