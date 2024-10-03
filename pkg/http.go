package pkg

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/mileusna/useragent"
)

var CustomClient = NewCustomHTTPClient()

type CustomHTTPClient struct {
	Client http.Client
}

type customTransport struct {
	roundTripper http.RoundTripper
}

func NewCustomHTTPClient() *CustomHTTPClient {
	return &CustomHTTPClient{
		Client: http.Client{
			Transport: &customTransport{
				roundTripper: http.DefaultTransport,
			},
		},
	}
}

func (cc *CustomHTTPClient) Get(url string) (*http.Response, error) {
	return cc.Client.Get(url)
}

func (cc *CustomHTTPClient) FetchIpInfoData(ipAddr string, ipInfoToken string) (IPInfoData, error) {
	if ipAddr == "" || ipInfoToken == "" {
		return IPInfoData{}, fmt.Errorf("ip address and IP Info Token cannot be empty")
	}

	endpoint := IPInfoEndpoint(ipAddr, ipInfoToken)
	resp, err := cc.Get(endpoint)
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

func (ct *customTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	if os.Getenv(EnvNodeEnv) == "development" {
		for regex, val := range DummyDataMap {
			b := []byte(req.URL.String())
			if matched, _ := regexp.Match(regex, b); matched {
				log.Println("Responding with dummy data")
				return createJSONResp(val), nil
			}
		}
	}
	return ct.roundTripper.RoundTrip(req)
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

func createJSONResp(v any) *http.Response {
	bytes, _ := json.Marshal(v)
	body := io.NopCloser(strings.NewReader(string(bytes)))
	return &http.Response{
		StatusCode: http.StatusOK,
		Body:       body,
		Header:     make(http.Header),
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

func GetLanguage(r http.Request) string {
	langStr := r.Header.Get("Accept-Language")
	if len(langStr) < 2 {
		return "unknown"
	}
	return strings.ToLower(langStr[:2])
}

func GetScreenRes(r http.Request) string {
	return r.Header.Get("Viewport-Width")
}

func GetPid(url url.URL) string {
	return url.Query().Get(string(QueryParamPid))
}

func GetRevenue(url url.URL) float64 {
	payoutStr := url.Query().Get(string(QueryParamPayout))
	revenue, err := strconv.ParseFloat(payoutStr, 64)
	if err != nil || revenue < 0 {
		return 0
	}
	return revenue
}

func IPInfoEndpoint(ipAddr string, ipInfoToken string) string {
	return "https://ipinfo.io/" + ipAddr + "?token=" + ipInfoToken
}
