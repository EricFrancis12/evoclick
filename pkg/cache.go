package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

const redisExpiry = time.Millisecond * 1000 * 60

type RedisKeyFunc func(prefix string) string

// Returns a function that generates Redis keys with the specified prefix.
func (s *Storer) MakeRedisKeyFunc(prefix string) RedisKeyFunc {
	return func(id string) string {
		return prefix + ":" + id
	}
}

// Saves a given value to Redis cache under the specified key.
// The value is marshaled to JSON and saved to Redis with a predefined expiry time.
func (s *Storer) SaveKeyToRedis(ctx context.Context, key string, value any) error {
	if s.Cache == nil {
		return fmt.Errorf("cache does not exist")
	}
	jsonData, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("error marshalling to JSON: " + err.Error())
	}
	_, err = s.Cache.Set(ctx, key, string(jsonData), redisExpiry).Result()
	if err != nil {
		return fmt.Errorf("error saving to Redis cache: " + err.Error())
	}
	return nil
}

// Checks if a given key exists in Redis and returns its value if found.
// The value is unmarshalled from JSON and returned as a generic type T.
func CheckRedisForKey[T any](cache *redis.Client, ctx context.Context, key string) (T, error) {
	var t T
	if cache == nil {
		return t, fmt.Errorf("cache does not exist")
	}

	// Check redis cache for key
	value, err := cache.Get(ctx, key).Result()
	if err != nil {
		return t, fmt.Errorf("error fetching from cache: " + err.Error())
	}

	// If found, parse and return it
	t, err = ParseJSON[T](value)
	if err != nil {
		return t, fmt.Errorf("error parsing JSON: " + err.Error())
	}

	return t, nil
}
