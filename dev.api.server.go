package main

import (
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

	router.HandleFunc("/click", handler.Click)
	router.HandleFunc("/postback", handler.Postback)
	router.HandleFunc("/t", handler.T)

	log.Println("Dev Server running on port: ", s.listenAddr)

	http.ListenAndServe(s.listenAddr, router)
}
