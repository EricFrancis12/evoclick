package pkg

import "fmt"

func determinePath(paths []Path) (Path, error) {
	totalWeight := TotalWeight(paths)

	// Generate a random number between 0 and totalWeight-1
	randnum := RandomInt(totalWeight)

	// Find the path corresponding to the random number
	runningWeight := 0
	for _, path := range paths {
		runningWeight += path.Weight
		if randnum < runningWeight {
			return path, nil
		}
	}

	return Path{}, fmt.Errorf("error selecting path")
}

func TotalWeight(paths []Path) int {
	totalWeight := 0
	for _, path := range paths {
		totalWeight += path.Weight
	}
	return totalWeight
}
