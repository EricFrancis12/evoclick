package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"

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
	resp, err := pkg.HttpClient.Get("https://barstoolsports.com/werwerwer")
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(string(body))

	v, err := pkg.ParseJSON[pkg.IPInfoData](string(body))
	if err != nil {
		log.Fatal(err)
	}

	jsonEncoder := json.NewEncoder(w)
	jsonEncoder.SetIndent("", "  ")

	debugResponse := &Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/test.go",
		Data:         v,
	}

	if err := jsonEncoder.Encode(debugResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
