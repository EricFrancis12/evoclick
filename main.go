package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/EricFrancis12/evoclick/api"
	"github.com/EricFrancis12/evoclick/pkg"
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
	if err := SafeLoadEnvs(".env.local", ".env"); err != nil {
		log.Fatal("error loading .env files: " + err.Error())
	}

	flag.Parse()
	args := flag.Args()
	if pkg.SliceIncludes(args, "dev") {
		log.Println("Starting in dev mode")
		if err := os.Setenv(pkg.EnvNodeEnv, "development"); err != nil {
			log.Fatal("error setting ENV: " + err.Error())
		}
	}

	port := os.Getenv(pkg.EnvApiPort)
	if port == "" {
		log.Fatal("api port not set")
	}

	if TCPPortOpen("localhost", port) {
		fmt.Println("TCP port " + port + " is already in use. Exiting gracefully.")
		os.Exit(0)
	}

	server := NewAPIServer(":" + port)
	log.Fatal(server.Run())
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()

	router.HandleFunc("/click", api.Click)
	router.HandleFunc("/postback", api.Postback)
	router.HandleFunc("/t", api.T)

	router.PathPrefix("/public").Handler(http.StripPrefix("/public", http.FileServer(http.Dir("./public"))))

	log.Println("EvoClick running on port", s.listenAddr)
	return http.ListenAndServe(s.listenAddr, router)
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
