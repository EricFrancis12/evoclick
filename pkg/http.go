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

func IPInfoEndpoint(ipAddr string, ipInfoToken string) string {
	return "https://ipinfo.io/" + ipAddr + "?token=" + ipInfoToken
}
