package handler

import (
	"encoding/json"
	"net/http"
	"net/url"
)

type Response struct {
	Path         string     `json:"path"`
	Method       string     `json:"method"`
	QueryStrings url.Values `json:"query_strings"`
	Message      string     `json:"message"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	jsonEncoder := json.NewEncoder(w)
	jsonEncoder.SetIndent("", "  ")

	debugResponse := &Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/t.go",
	}

	err := jsonEncoder.Encode(debugResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
