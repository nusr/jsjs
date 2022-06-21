package main

type ExpectCases struct {
	success int
	fail    int
}

var globalExpect *ExpectCases

func init() {
	globalExpect = NewExpectCases()
}

func NewExpectCases() *ExpectCases {
	return &ExpectCases{
		success: 0,
		fail:    0,
	}
}

func (expectCases *ExpectCases) addSuccess() {
	expectCases.success++
}

func (expectCases *ExpectCases) addFail() {
	expectCases.fail++
}
