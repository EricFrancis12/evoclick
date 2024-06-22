package pkg

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/redis/go-redis/v9"
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
	Client        *db.PrismaClient
	PrismaRenewal time.Time
	Cache         *redis.Client
	RedisRenewal  time.Time
}

func NewStorer() *Storer {
	return &Storer{}
}

func (s *Storer) Renew() {
	if s.Client == nil {
		s.Client = db.NewClient()
		s.PrismaRenewal = time.Now()
		fmt.Println("Created Prisma client")
	}

	if err := s.Client.Prisma.Connect(); err != nil {
		fmt.Println("error connecting to db:", err.Error())
	} else {
		fmt.Println("Connected to db")
	}

	if s.Cache == nil {
		connStr := os.Getenv("REDIS_URL")
		if connStr == "" {
			return
		}

		opt, err := redis.ParseURL(connStr)
		if err != nil {
			fmt.Println("error parsing Redis connection string:", err.Error())
			return
		}

		s.Cache = redis.NewClient(opt)
		s.RedisRenewal = time.Now()
		fmt.Println("Created Redis client")
	}
}

func parseJSON[T any](jsonStr string) (T, error) {
	fmt.Println("jsonStr: ", jsonStr)
	var v T
	if err := json.Unmarshal([]byte(jsonStr), &v); err != nil {
		return v, err
	}
	return v, nil
}

type RedisKeyFunc func(prefix string) string

func InitMakeRedisKey(prefix string) RedisKeyFunc {
	return func(id string) string {
		return prefix + ":" + id
	}
}
