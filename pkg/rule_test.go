package pkg

import (
	"net/http"
	"net/url"
	"testing"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
	"github.com/stretchr/testify/assert"
)

func TestRules(t *testing.T) {
	var browsers = []string{"Chrome", "Edge", "Safari"}

	t.Run("Test ViewDoesTrigger with non-custom RuleName", func(t *testing.T) {
		assert.False(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: true,
		}.ViewDoesTrigger(http.Request{}, useragent.UserAgent{}, IPInfoData{}, []Token{}))

		assert.True(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: false,
		}.ViewDoesTrigger(http.Request{}, useragent.UserAgent{}, IPInfoData{}, []Token{}))

		assert.True(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: true,
		}.ViewDoesTrigger(http.Request{}, useragent.UserAgent{Name: browsers[0]}, IPInfoData{}, []Token{}))

		assert.False(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: false,
		}.ViewDoesTrigger(http.Request{}, useragent.UserAgent{Name: browsers[0]}, IPInfoData{}, []Token{}))
	})

	t.Run("Test ViewDoesTrigger with custom RuleName (from traffic source custom tokens)", func(t *testing.T) {
		var (
			queryParam = "zone_id"
			value      = "87654321"
			token      = Token{
				QueryParam: queryParam,
				Value:      value,
			}
			ruleName RuleName = token.CustomRuleName()
			data              = []string{value}
		)

		assert.False(t, Rule{
			RuleName: ruleName,
			Data:     []string{},
			Includes: true,
		}.ViewDoesTrigger(http.Request{}, useragent.UserAgent{}, IPInfoData{}, []Token{token}))

		assert.True(t, Rule{
			RuleName: ruleName,
			Data:     []string{},
			Includes: false,
		}.ViewDoesTrigger(http.Request{}, useragent.UserAgent{}, IPInfoData{}, []Token{token}))

		r := http.Request{
			URL: &url.URL{
				RawQuery: queryParam + "=" + value,
			},
		}

		assert.True(t, Rule{
			RuleName: ruleName,
			Data:     data,
			Includes: true,
		}.ViewDoesTrigger(r, useragent.UserAgent{}, IPInfoData{}, []Token{token}))

		assert.False(t, Rule{
			RuleName: ruleName,
			Data:     data,
			Includes: false,
		}.ViewDoesTrigger(r, useragent.UserAgent{}, IPInfoData{}, []Token{token}))
	})

	t.Run("Test ClickDoesTrigger", func(t *testing.T) {
		click := Click{
			InnerClick: db.InnerClick{
				BrowserName: browsers[0],
			},
		}

		assert.False(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: true,
		}.ClickDoesTrigger(Click{}))

		assert.True(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: false,
		}.ClickDoesTrigger(Click{}))

		assert.True(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: true,
		}.ClickDoesTrigger(click))

		assert.False(t, Rule{
			RuleName: RuleNameBrowserName,
			Data:     browsers,
			Includes: false,
		}.ClickDoesTrigger(click))
	})
}
