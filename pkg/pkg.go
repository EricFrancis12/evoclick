package pkg

import "net/url"

type User struct {
	Id   int
	Name string
}

func NewUser() *User {
	return &User{}
}

type Response struct {
	Path         string     `json:"path"`
	Method       string     `json:"method"`
	QueryStrings url.Values `json:"query_strings"`
	Message      string     `json:"message"`
}
