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
    Index     int64           `json:"index"`
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

// With a single answer

type SingleAnswerTranslationQuestion struct {
	Type      int    `json:"type"`
	Given     string `json:"given"`
	Answer    string `json:"answer"`
}

func NewSATQ(given string, answer string) SingleAnswerTranslationQuestion {
	tq := SingleAnswerTranslationQuestion{Type: 0, Given: given, Answer: answer}
	return tq
}

func (q SingleAnswerTranslationQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// With multiple answers

type MultipleAnswerTranslationQuestion struct {
	Type      int      `json:"type"`
	Given     string   `json:"given"`
	Answers   []string `json:"answers"`
}

func NewMATQ(given string, answers []string) MultipleAnswerTranslationQuestion {
	tq := MultipleAnswerTranslationQuestion{Type: 0, Given: given, Answers: answers}
	return tq
}

func (q MultipleAnswerTranslationQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// RQ

type ReadingQuestion struct {
	Type    	int    			   `json:"type"`
	Extract		string 			   `json:"extract"`
	Questions   []JsonEncodable    `json:"questions"`
}

func NewRQ(extract string, questions []JsonEncodable) ReadingQuestion {
	rq := ReadingQuestion{Type: 2, Extract: extract, Questions: questions}
	return rq
}

func (q ReadingQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// RSQ

// Single Answer

type SingleAnswerReadingSubQuestion struct {
    Index     int64  `json:"index"`
	Given     string `json:"given"`
	Answer    string `json:"answer"`
}

func NewSARSQ(index int64, given string, answer string) SingleAnswerReadingSubQuestion {
	rsq := SingleAnswerReadingSubQuestion{Index: index, Given: given, Answer: answer}
	return rsq
}

func (q SingleAnswerReadingSubQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// Multiple Answer

type MultipleAnswerReadingSubQuestion struct {
    Index     int64     `json:"index"`
	Given     string    `json:"given"`
	Answers   []string  `json:"answers"`
}

func NewMARSQ(index int64, given string, answers []string) MultipleAnswerReadingSubQuestion {
	rsq := MultipleAnswerReadingSubQuestion{Index: index, Given: given, Answers: answers}
	return rsq
}

func (q MultipleAnswerReadingSubQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// Course Metadata

type LessonMetadata struct {
    Name      string          `json:"name"`
    Index     int64           `json:"index"`
}

type CourseMetadata struct {
    LessonMetadata []LessonMetadata `json:"lessonMetadata"`
}
