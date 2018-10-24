package main

import (
	"net/http"
	"encoding/json"
)

type JsonEncodable interface {
	encode(w http.ResponseWriter) error
}

// Lesson

type Lesson struct {
	Name      string          `json:"name"`
	Questions [2]JsonEncodable `json:"questions"`
}

// MCQ

type MultipleChoiceQuestion struct {
	Type      int    `json:"type"`
	Question  string `json:"question"`
	A         string `json:"a"`
	B         string `json:"b"`
	C         string `json:"c"`
	D         string `json:"d"`
	Answer    string `json:"answer"`
}

func NewMCQ(question string, a string, b string, c string, d string, answer string,) MultipleChoiceQuestion {
	mcq := MultipleChoiceQuestion{Type: 1, Question:question, A:a, B:b, C:c, D:d, Answer:answer}
	return mcq
}

func (q MultipleChoiceQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// TQ

type TranslationQuestion struct {
	Type      int    `json:"type"`
	Given     string `json:"given"`
	Answer    string `json:"answer"`
}

func NewTQ(given string, answer string) TranslationQuestion {
	tq := TranslationQuestion{Type: 0, Given:given, Answer:answer}
	return tq
}

func (q TranslationQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}