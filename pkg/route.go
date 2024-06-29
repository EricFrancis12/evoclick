package pkg

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/mileusna/useragent"
)

type DoesTriggerRuleFunc func(rule Rule) bool

// Determine if any rule in this route triggers based on a given condition
func (route Route) doesTrigger(condition DoesTriggerRuleFunc) bool {
	if !route.IsActive {
		return false
	}

	bools := []bool{}
	for _, rule := range route.Rules {
		bools = append(bools, condition(rule))
	}

	if route.LogicalRelation == LogicalRelationAnd {
		// Handle "AND" logical relation
		// Check if at least one result is false
		return !sliceIncludes(bools, false)
	} else if route.LogicalRelation == LogicalRelationOr {
		// Handle "OR" logical relation
		// Check if at least one result is true
		return sliceIncludes(bools, true)
	}

	return false
}

// Determine if the view triggers any rules in this route
func (route Route) ViewDoesTrigger(r *http.Request, ua useragent.UserAgent, ipInfoData IPInfoData) bool {
	return route.doesTrigger(func(rule Rule) bool {
		return rule.ViewDoesTrigger(r, ua, ipInfoData)
	})
}

// Determine if the click triggers any rules in this route
func (route Route) ClickDoesTrigger(click Click) bool {
	return route.doesTrigger(func(rule Rule) bool {
		return rule.ClickDoesTrigger(click)
	})
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
