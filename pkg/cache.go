package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func ConnectToReddis(connStr string) (*redis.Client, error) {
	opts, err := redis.ParseURL(connStr)
	if err != nil {
		return nil, fmt.Errorf("error parsing Redis connection string: " + err.Error())
	}
	return redis.NewClient(opts), nil
}

type RedisKeyFunc func(prefix string) string

func InitMakeRedisKey(prefix string) RedisKeyFunc {
	return func(id string) string {
		return prefix + ":" + id
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
