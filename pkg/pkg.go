package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
	"github.com/redis/go-redis/v9"
)

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

var ipBlacklist = []string{
	"[::1]*",
}

func FetchIpInfo(ipAddr string, ipInfoToken string) (*IPInfoData, error) {
	if ipAddr == "" || ipInfoToken == "" {
		return nil, fmt.Errorf(emptyStringError)
	}
	isMatch, err := matchValAgainstRegexSlice(ipBlacklist, ipAddr)
	if err != nil {
		return nil, err
	}
	if isMatch {
		return nil, fmt.Errorf(makeBlacklistErr(ipAddr))
	}

	endpoint := "https://ipinfo.io/" + ipAddr + "?token=" + ipInfoToken
	resp, err := http.Get(endpoint)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	ipInfoData, err := ParseJSON[IPInfoData](string(body))
	if err != nil {
		return nil, err
	}

	return &ipInfoData, nil
}

const emptyStringError = "ip address and IP Info Token cannot be empty"

func makeBlacklistErr(ipAddr string) string {
	return "ip address: \"" + ipAddr + "\" found on blacklist"
}

func GetDeviceType(ua useragent.UserAgent) DeviceType {
	if ua.Desktop {
		return DeviceTypeDesktop
	} else if ua.Tablet {
		return DeviceTypeTablet
	} else if ua.Mobile {
		return DeviceTypeMobile
	}
	return DeviceTypeUnknown
}

func GetLanguage(r *http.Request) string {
	return r.Header.Get("Accept-Language")
}

func GetScreenRes(r *http.Request) string {
	return r.Header.Get("Viewport-Width")
}

func ParseJSON[T any](jsonStr string) (T, error) {
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

func GetCatchAllUrl() string {
	catchAllUrl := os.Getenv("CATCH_ALL_REDIRECT_URL")
	if catchAllUrl == "" {
		return "https://bing.com"
	}
	return catchAllUrl
}
