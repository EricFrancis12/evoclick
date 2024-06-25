package pkg

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/mileusna/useragent"
)

// Determine if the view triggers any rules in this route
// TODO: Create a way to merge ViewDoesTrigger with ClickDoesTrigger
func (route Route) ViewDoesTrigger(r *http.Request, ua useragent.UserAgent, ipInfoData IPInfoData) bool {
	if !route.IsActive {
		return false
	}

	result := []bool{}
	for _, rule := range route.Rules {
		result = append(result, rule.ViewDoesTrigger(r, ua, ipInfoData))
	}

	if route.LogicalRelation == LogicalRelationAnd {
		// Handle "AND" logical relation
		// Check if at least one result is false
		return !sliceIncludes(result, false)
	} else if route.LogicalRelation == LogicalRelationOr {
		// Handle "OR" logical relation
		// Check if at least one result is true
		return sliceIncludes(result, true)
	}

	return false
}

// Determine if the click triggers any rules in this route
func (route Route) ClickDoesTrigger(click Click) bool {
	if !route.IsActive {
		return false
	}

	result := []bool{}
	for _, rule := range route.Rules {
		result = append(result, rule.ClickDoesTrigger(click))
	}

	if route.LogicalRelation == LogicalRelationAnd {
		// Handle "AND" logical relation
		// Check if at least one result is false
		return !sliceIncludes(result, false)
	} else if route.LogicalRelation == LogicalRelationOr {
		// Handle "OR" logical relation
		// Check if at least one result is true
		return sliceIncludes(result, true)
	}

	return false
}

func (r *Route) WeightedSelectPath() (Path, error) {
	if len(r.Paths) == 0 {
		return Path{}, fmt.Errorf("paths slice is empty")
	}

	activePaths := r.ActivePaths()
	if len(activePaths) == 0 {
		return Path{}, fmt.Errorf("route has no active paths")
	}

	// Calculate the total weight
	totalWeight := 0
	for _, path := range activePaths {
		totalWeight += path.Weight
	}

	// Generate a random number between 0 and totalWeight-1
	rand.Seed(time.Now().UnixNano())
	randnum := rand.Intn(totalWeight)

	// Find the path corresponding to the random number
	runningWeight := 0
	for _, path := range activePaths {
		runningWeight += path.Weight
		if randnum < runningWeight {
			return path, nil
		}
	}

	return Path{}, fmt.Errorf("error selecting path")
}

func (r *Route) ActivePaths() []Path {
	return FilterSlice(r.Paths, func(p Path) bool {
		return p.IsActive
	})
}
