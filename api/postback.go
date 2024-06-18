package handler

import (
	"encoding/json"
	"net/http"

	pkg "github.com/EricFrancis12/evoclick/pkg"
)

func Postback(w http.ResponseWriter, r *http.Request) {
	jsonEncoder := json.NewEncoder(w)
	jsonEncoder.SetIndent("", "  ")

	debugResponse := &pkg.Response{
		Path:         r.URL.Path,
		QueryStrings: r.URL.Query(),
		Method:       r.Method,
		Message:      "Hello from ./api/postback.go",
	}

	err := jsonEncoder.Encode(debugResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
