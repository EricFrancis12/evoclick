package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	handler "github.com/EricFrancis12/evoclick/api"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

const port = "3001"

type APIServer struct {
	listenAddr string
}

func NewAPIServer(listenAddr string) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
	}
}

func main() {
	if err := SafeLoadEnvs(".env.local", ".env"); err != nil {
		log.Fatal("error loading .env files: " + err.Error())
	}
	if err := os.Setenv("NODE_ENV", "development"); err != nil {
		log.Fatal("error setting ENV: " + err.Error())
	}

	if TCPPortOpen("localhost", port) {
		fmt.Println("TCP port " + port + " is already in use. Dev API exiting gracefully.")
		os.Exit(0)
	}

	server := NewAPIServer(":" + port)
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

func TCPPortOpen(host string, port string) bool {
	conn, err := net.DialTimeout("tcp", net.JoinHostPort(host, port), time.Second)
	if err != nil {
		return false
	}
	defer conn.Close()
	return true
}

func SafeLoadEnvs(filenames ...string) error {
	validFilenames := []string{}
	for _, fn := range filenames {
		if fileExists(fn) {
			validFilenames = append(validFilenames, fn)
		}
	}
	if len(validFilenames) == 0 {
		fmt.Println("No env files found")
		return nil
	}
	return godotenv.Load(validFilenames...)
}

func fileExists(filepath string) bool {
	_, err := os.Stat(filepath)
	if os.IsNotExist(err) {
		return false
	}
	return err == nil
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
