package pkg

import (
	"net/http"

	"github.com/mileusna/useragent"
)

type RulesMap map[RuleName]string

// Determines if the view triggers this rule
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

// Determine if the view triggers this rule
func (rule Rule) ClickDoesTrigger(click Click) bool {
	rulesMap := make(RulesMap)

	rulesMap[RuleNameBrowserName] = click.BrowserName
	rulesMap[RuleNameBrowserVersion] = click.BrowserVersion
	rulesMap[RuleNameCity] = click.City
	rulesMap[RuleNameCountry] = click.Country
	rulesMap[RuleNameDevice] = click.Device
	rulesMap[RuleNameDeviceType] = click.DeviceType
	rulesMap[RuleNameIP] = click.IP
	rulesMap[RuleNameISP] = click.Isp
	rulesMap[RuleNameLanguage] = click.Language
	rulesMap[RuleNameOS] = click.Os
	rulesMap[RuleNameOSVersion] = click.OsVersion
	rulesMap[RuleNameRegion] = click.Region
	rulesMap[RuleNameScreenResolution] = click.ScreenResolution
	rulesMap[RuleNameUserAgent] = click.UserAgent

	return rulesMap.checkForMatch(rule)
}

func (rm RulesMap) checkForMatch(rule Rule) bool {
	for _, str := range rule.Data {
		if rm[rule.RuleName] == str {
			return rule.Includes
		}
	}
	return !rule.Includes
}
