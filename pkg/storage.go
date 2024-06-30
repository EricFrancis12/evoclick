package pkg

import (
	"context"
	"encoding/json"
	"fmt"
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
		fmt.Println("Created Redis client")
	}
}

func CheckRedisForKey[T any](ctx context.Context, cache *redis.Client, key string) (*T, error) {
	if cache == nil {
		return nil, fmt.Errorf("cache has not been created")
	}

	// Check redis cache for this key
	cachedResult, err := cache.Get(ctx, key).Result()
	if err != nil {
		return nil, fmt.Errorf("error fetching from cache: " + err.Error())
	}

	// If found in the cache, parse and return it
	t, err := ParseJSON[T](cachedResult)
	if err != nil {
		return nil, fmt.Errorf("error parsing JSON: " + err.Error())
	}

	return &t, nil
}

func SaveKeyToRedis(ctx context.Context, cache *redis.Client, key string, v any) error {
	jsonData, err := json.Marshal(v)
	if err != nil {
		return fmt.Errorf("error marshalling to JSON: %s", err)
	}
	_, err = cache.Set(ctx, key, string(jsonData), time.Millisecond*1000*60).Result()
	if err != nil {
		return fmt.Errorf("error saving to Redis cache: %s", err)
	}
	return nil
}
