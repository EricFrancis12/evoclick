package main

import (
	"log"
	"net/http"
	"os"

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
	router.HandleFunc("/sample-landing-page", HandleSampleLandingPage)
	router.HandleFunc("/test", handler.Test)

	log.Println("Dev API running on port", s.listenAddr)

	return http.ListenAndServe(s.listenAddr, router)
}

func HandleSampleLandingPage(w http.ResponseWriter, r *http.Request) {
	fpath := "./assets/sample-landing-page.html"
	htmlContent, err := os.ReadFile(fpath)
	if err != nil {
		http.Error(w, "error reading HTML file at: "+fpath, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html")
	w.Write(htmlContent)
}
