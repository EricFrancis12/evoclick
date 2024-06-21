package pkg

import (
	"encoding/json"
	"fmt"
	"net/url"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
)

// Test response for api routes
type Response struct {
	Path         string     `json:"path"`
	Method       string     `json:"method"`
	QueryStrings url.Values `json:"query_strings"`
	Message      string     `json:"message"`
	Data         any        `json:"data"`
}

type Storer struct {
	Client    *db.PrismaClient
	RenewedAt time.Time
}

func NewStorer() *Storer {
	return &Storer{}
}

func (s *Storer) Renew() error {
	if s.Client == nil {
		s.Client = db.NewClient()
		s.RenewedAt = time.Now()
		fmt.Println("Created Prisma client")
	}

	if err := s.Client.Prisma.Connect(); err != nil {
		fmt.Println("error connecting to db:", err.Error())
		return err
	}

	fmt.Println("Connected to db")
	return nil
}

func parseJSON(jsonStr string, v any) {
	if err := json.Unmarshal([]byte(jsonStr), &v); err != nil {
		fmt.Printf("Error parsing JSON: %s", err)
	}
}
