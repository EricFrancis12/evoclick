package pkg

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/redis/go-redis/v9"
)

type Storer struct {
	Client *db.PrismaClient
	Cache  *redis.Client
}

func NewStorer() *Storer {
	return &Storer{}
}

func (s *Storer) InitVisit(r *http.Request) (time.Time, context.Context) {
	s.Renew()
	return time.Now(), r.Context()
}

func (s *Storer) Renew() {
	if s.Client == nil {
		s.Client = db.NewClient()
		fmt.Println("Created Prisma client")
	}

	if err := s.Client.Prisma.Connect(); err != nil {
		fmt.Println("error connecting to db:", err.Error())
	} else {
		fmt.Println("Connected to db")
	}

	if s.Cache != nil {
		return
	}

	if connStr := os.Getenv(EnvRedisUrl); connStr != "" {
		if err := s.ConnectToRedis(connStr); err != nil {
			fmt.Println(err.Error())
		} else {
			fmt.Println("Connected to Reddis")
		}
	}
}

func (s *Storer) ConnectToRedis(connStr string) error {
	opts, err := redis.ParseURL(connStr)
	if err != nil {
		return fmt.Errorf("error parsing Redis connection string: " + err.Error())
	}
	s.Cache = redis.NewClient(opts)
	return nil
}
