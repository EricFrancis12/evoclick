package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/EricFrancis12/evoclick/pkg"
)

// Test response for api routes
type Response struct {
	Path         string     `json:"path"`
	Method       string     `json:"method"`
	QueryStrings url.Values `json:"query_strings"`
	Message      string     `json:"message"`
	Data         any        `json:"data"`
}

func Test(w http.ResponseWriter, r *http.Request) {
	ipInfoToken := os.Getenv("IP_INFO_TOKEN")
	endpoint := "https://ipinfo.io/" + "24.53.137.36" + "?token=" + ipInfoToken
	resp, err := http.Get(endpoint)
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(body)
	fmt.Println(string(body))

	ipInfoData, err := pkg.ParseJSON[pkg.IPInfoData](string(body))
	if err != nil {
		fmt.Println(err)
	}

	jsonEncoder := json.NewEncoder(w)
	jsonEncoder.SetIndent("", "  ")

	debugResponse := &Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/test.go",
		Data:         ipInfoData,
	}

	if err := jsonEncoder.Encode(debugResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
