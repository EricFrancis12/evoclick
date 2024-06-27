package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	handler "github.com/EricFrancis12/evoclick/api"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
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
	if err := godotenv.Load(".env.local", ".env"); err != nil {
		log.Fatal("error loading .env files: " + err.Error())
	}
	if err := os.Setenv("NODE_ENV", "development"); err != nil {
		log.Fatal("error setting ENV: " + err.Error())
	}

	server := NewAPIServer(":3001")
	err := server.Run()
	if err != nil {
		log.Fatal("error starting Dev API: " + err.Error())
	}
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()

	router.HandleFunc("/click", handler.Click)
	router.HandleFunc("/postback", handler.Postback)
	router.HandleFunc("/t", handler.T)
	router.HandleFunc("/assets/{file}", HandleAssets)
	router.HandleFunc("/test", handler.Test)

	log.Println("Dev API running on port", s.listenAddr)

	return http.ListenAndServe(s.listenAddr, router)
}

func HandleAssets(w http.ResponseWriter, r *http.Request) {
	file := mux.Vars(r)["file"]
	if file == "" {
		http.Error(w, "please specify a file", http.StatusBadRequest)
		return
	}
	filepath := "./assets/" + file
	bytes, err := os.ReadFile(filepath)
	if err != nil {
		http.Error(w, "error reading file at: "+filepath, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", contentType(file))
	w.Write(bytes)
}

func contentType(f string) string {
	spl := strings.Split(f, ".")
	fext := spl[len(spl)-1]
	if fext == "html" {
		return "text/html"
	}
	if fext == "css" {
		return "text/css"
	}
	return "text/plain"
}
