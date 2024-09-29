package pkg

import (
	"net/http"

	"github.com/mileusna/useragent"
)

type RulesMap map[RuleName]string

// Determines if the view triggers this rule
func (rule Rule) ViewDoesTrigger(r http.Request, ua useragent.UserAgent, ipInfoData IPInfoData, tokens []Token) bool {
	rulesMap := newRulesMapFromView(r, ua, ipInfoData, tokens)
	return rulesMap.checkForMatch(rule)
}

// Determine if the view triggers this rule
func (rule Rule) ClickDoesTrigger(click Click) bool {
	rulesMap := newRulesMapFromClick(click)
	return rulesMap.checkForMatch(rule)
}

// Determine if a rule triggers this RulesMap
func (rm RulesMap) checkForMatch(rule Rule) bool {
	for _, str := range rule.Data {
		if rm[rule.RuleName] == str {
			return rule.Includes
		}
	}
	return !rule.Includes
}

func toCustomRuleName(queryParam string) string {
	return "Custom-Rule-" + queryParam
}

func (t Token) CustomRuleName() string {
	return toCustomRuleName(t.QueryParam)
}

// Helper function to create RulesMap from request, user agent, and ipInfoData
func newRulesMapFromView(r http.Request, ua useragent.UserAgent, ipInfoData IPInfoData, tokens []Token) RulesMap {
	rm := RulesMap{
		RuleNameBrowserName:      ua.Name,
		RuleNameBrowserVersion:   ua.Version,
		RuleNameCity:             ipInfoData.City,
		RuleNameCountry:          ipInfoData.Country,
		RuleNameDevice:           ua.Device,
		RuleNameDeviceType:       string(GetDeviceType(ua)),
		RuleNameIP:               r.RemoteAddr,
		RuleNameISP:              ipInfoData.Org,
		RuleNameLanguage:         GetLanguage(r),
		RuleNameOS:               ua.OS,
		RuleNameOSVersion:        ua.OSVersion,
		RuleNameRegion:           ipInfoData.Region,
		RuleNameScreenResolution: GetScreenRes(r),
		RuleNameUserAgent:        r.UserAgent(),
	}

	// Loop through query string grabbing additional query params,
	// then check the corresponding tokens for any matches.
	// And if so, add them to the RulesMap.
	for _, token := range tokens {
		rm[token.CustomRuleName()] = token.Value
	}

	return rm
}

// Helper function to create RulesMap from click
func newRulesMapFromClick(click Click) RulesMap {
	rm := RulesMap{
		RuleNameBrowserName:      click.BrowserName,
		RuleNameBrowserVersion:   click.BrowserVersion,
		RuleNameCity:             click.City,
		RuleNameCountry:          click.Country,
		RuleNameDevice:           click.Device,
		RuleNameDeviceType:       click.DeviceType,
		RuleNameIP:               click.IP,
		RuleNameISP:              click.Isp,
		RuleNameLanguage:         click.Language,
		RuleNameOS:               click.Os,
		RuleNameOSVersion:        click.OsVersion,
		RuleNameRegion:           click.Region,
		RuleNameScreenResolution: click.ScreenResolution,
		RuleNameUserAgent:        click.UserAgent,
	}

	// Loop through query string grabbing additional query params,
	// then check click.Tokens for any matches.
	// And if so, add them to the RulesMap.
	for _, token := range click.Tokens {
		rm[token.CustomRuleName()] = token.Value
	}

	return rm
}
