package pkg

import (
	"net/http"

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

type RulesMap map[RuleName]string

// Determine if the view triggers this rule
func (rule Rule) ViewDoesTrigger(r *http.Request, ua useragent.UserAgent, ipInfoData IPInfoData) bool {
	userAgentStr := r.UserAgent()
	rulesMap := make(RulesMap)

	rulesMap[RuleNameBrowserName] = ua.Name
	rulesMap[RuleNameBrowserVersion] = ua.Version
	rulesMap[RuleNameCity] = ipInfoData.City
	rulesMap[RuleNameCountry] = ipInfoData.Country
	rulesMap[RuleNameDevice] = ua.Device
	rulesMap[RuleNameDeviceType] = string(GetDeviceType(ua))
	rulesMap[RuleNameIP] = r.RemoteAddr
	rulesMap[RuleNameISP] = ipInfoData.Org
	rulesMap[RuleNameLanguage] = GetLanguage(r)
	rulesMap[RuleNameOS] = ua.OS
	rulesMap[RuleNameOSVersion] = ua.OSVersion
	rulesMap[RuleNameRegion] = ipInfoData.Region
	rulesMap[RuleNameScreenResolution] = GetScreenRes(r)
	rulesMap[RuleNameUserAgent] = userAgentStr

	return rulesMap.checkForMatch(rule)
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

// Determine if the view triggers this rule
func (rule Rule) ClickDoesTrigger(click Click) bool {
	rulesMap := make(RulesMap)

	rulesMap[RuleNameBrowserName] = click.BrowserName
	rulesMap[RuleNameBrowserVersion] = click.BrowserVersion
	rulesMap[RuleNameCity] = *click.City
	rulesMap[RuleNameCountry] = *click.Country
	rulesMap[RuleNameDevice] = click.Device
	rulesMap[RuleNameDeviceType] = click.DeviceType
	rulesMap[RuleNameIP] = click.IP
	rulesMap[RuleNameISP] = *click.Isp
	rulesMap[RuleNameLanguage] = click.Language
	rulesMap[RuleNameOS] = click.Os
	rulesMap[RuleNameOSVersion] = click.OsVersion
	rulesMap[RuleNameRegion] = *click.Region
	rulesMap[RuleNameScreenResolution] = click.ScreenResolution
	rulesMap[RuleNameUserAgent] = click.UserAgent

	return rulesMap.checkForMatch(rule)
}

func (rm RulesMap) checkForMatch(rule Rule) bool {
	for _, str := range rule.Data {
		if rm[rule.RuleName] == str {
			// TODO: Write test for this return value:
			return rule.Includes
		}
	}
	return false
}

func RulesNeedIpInfo(routes []Route) bool {
	ipInfoNeeded := make(map[RuleName]bool)

	// An API call is needed to obtain this data:
	ipInfoNeeded[RuleNameRegion] = true
	ipInfoNeeded[RuleNameCountry] = true
	ipInfoNeeded[RuleNameCity] = true
	ipInfoNeeded[RuleNameISP] = true

	// Loop over all rules to determine if there are
	// any rules that require an API call
	for _, route := range routes {
		for _, rule := range route.Rules {
			if ipInfoNeeded[rule.RuleName] {
				return true
			}
		}
	}
	return false
}
