package main

import (
	"net/http"
	"reflect"
	"testing"

	handler "github.com/EricFrancis12/evoclick/api"
	"github.com/stretchr/testify/assert"
)

func TestClickHandler(t *testing.T) {
	assert.True(t, isValidHandler(handler.Click))
}

func TestPostbackHandler(t *testing.T) {
	assert.True(t, isValidHandler(handler.Postback))
}

func TestTHandler(t *testing.T) {
	assert.True(t, isValidHandler(handler.T))
}

func isValidHandler(handler http.HandlerFunc) bool {
	handlerType := reflect.TypeOf(handler)

	// Check that the handler does not return any value.
	// This is important because if this project is deployed to Vercel,
	// the build will fail if the handlers return any value.
	if handlerType.NumOut() != 0 {
		return false
	}

	// Check that the handler is a function
	if handlerType.Kind() != reflect.Func {
		return false
	}

	// Check that the handler takes exactly 2 parameters
	if handlerType.NumIn() != 2 {
		return false
	}

	// Check that the first parameter is of type http.ResponseWriter
	if handlerType.In(0) != reflect.TypeOf((*http.ResponseWriter)(nil)).Elem() {
		return false
	}

	// Check that the second parameter is of type *http.Request
	if handlerType.In(1) != reflect.TypeOf(&http.Request{}) {
		return false
	}

	return true
}
