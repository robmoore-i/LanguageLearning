package main

import (
	"net/http"
	"encoding/json"
)

type JsonEncodable interface {
	encode(w http.ResponseWriter) error
}

// Course

type Course struct {
	Name   		string  `json:"name"`
	Image  		string	`json:"image"`
	ImageType  	string	`json:"imageType"`
}

// Lesson

type Lesson struct {
	Name      string          `json:"name"`
	Questions []JsonEncodable `json:"questions"`
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
	mcq := MultipleChoiceQuestion{Type: 1, Question: question, A: a, B: b, C: c, D: d, Answer: answer}
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
	tq := TranslationQuestion{Type: 0, Given: given, Answer: answer}
	return tq
}

func (q TranslationQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// RQ

type ReadingQuestion struct {
	Type    	int    					`json:"type"`
	Extract		string 					`json:"extract"`
	Questions   []ReadingSubQuestion 	`json:"questions"`
}

func NewRQ(extract string, questions []ReadingSubQuestion) ReadingQuestion {
	rq := ReadingQuestion{Type: 2, Extract: extract, Questions: questions}
	return rq
}

func (q ReadingQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// RSQ

type ReadingSubQuestion struct {
	Given     string `json:"given"`
	Answer    string `json:"answer"`
}

func NewRSQ(given string, answer string) ReadingSubQuestion {
	rsq := ReadingSubQuestion{Given: given, Answer: answer}
	return rsq
}

func (q ReadingSubQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}