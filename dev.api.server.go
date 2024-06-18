package main

import (
	"encoding/json"
	"log"
	"net/http"

	handler "github.com/EricFrancis/evoclick/api"
	"github.com/gorilla/mux"
)

type APIServer struct {
	listenAddr string
}

func NewAPIServer(listenAddr string) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
	}
}

func main() {
	server := NewAPIServer(":3001")
	server.Run()
}

func (s *APIServer) Run() {
	router := mux.NewRouter()

	router.HandleFunc("/t", makeHTTPHandleFunc(handler.Handler))

	log.Println("Dev Server running on port: ", s.listenAddr)

	http.ListenAndServe(s.listenAddr, router)
}

type ApiError struct {
	Error string `json:"error"`
}

type apiFunc func(http.ResponseWriter, *http.Request) error

func makeHTTPHandleFunc(f apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}
	}
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}
