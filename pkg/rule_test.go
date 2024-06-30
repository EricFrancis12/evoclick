package pkg

import (
	"net/http"
	"testing"

	"github.com/EricFrancis12/evoclick/prisma/db"
	"github.com/mileusna/useragent"
	"github.com/stretchr/testify/assert"
)

var browsers = []string{"Chrome", "Edge", "Safari"}

func TestViewDoesTrigger(t *testing.T) {
	assert.False(t, Rule{
		RuleName: RuleNameBrowserName,
		Data:     browsers,
		Includes: true,
	}.ViewDoesTrigger(&http.Request{}, useragent.UserAgent{}, IPInfoData{}))

	assert.True(t, Rule{
		RuleName: RuleNameBrowserName,
		Data:     browsers,
		Includes: false,
	}.ViewDoesTrigger(&http.Request{}, useragent.UserAgent{}, IPInfoData{}))

	assert.True(t, Rule{
		RuleName: RuleNameBrowserName,
		Data:     browsers,
		Includes: true,
	}.ViewDoesTrigger(&http.Request{}, useragent.UserAgent{Name: browsers[0]}, IPInfoData{}))

	assert.False(t, Rule{
		RuleName: RuleNameBrowserName,
		Data:     browsers,
		Includes: false,
	}.ViewDoesTrigger(&http.Request{}, useragent.UserAgent{Name: browsers[0]}, IPInfoData{}))
}

func TestClickDoesTrigger(t *testing.T) {
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
}
