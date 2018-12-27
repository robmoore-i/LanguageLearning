package main

import (
    b64 "encoding/base64"
	"net/http"
	"encoding/json"
    "log"
	"strings"
)

var (
    SVG = "svg"
    PNG = "png"
    JPG = "jpg"
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

func NewCourse(name string, imgFileBytes []byte, imgType string) Course {
    if imgType == SVG {
        return Course{Name: name, Image: string(imgFileBytes), ImageType: imgType}
    } else if imgType == PNG {
        encoded := b64.StdEncoding.EncodeToString(imgFileBytes)
        return Course{Name: name, Image: encoded, ImageType: imgType}
    } else if imgType == JPG {
        encoded := b64.StdEncoding.EncodeToString(imgFileBytes)
        return Course{Name: name, Image: encoded, ImageType: imgType}
    } else {
        errorMsg := strings.Join([]string{"Image is none of [", SVG, " | ", PNG, " | ", JPG, "]"}, "")
        log.Printf(errorMsg)
        panic("structures:NewCourse")
    }
}

// Lesson

type Lesson struct {
	Name      string          `json:"name"`
	Questions []JsonEncodable `json:"questions"`
    Index     int64           `json:"index"`
}

// MCQ

type MultipleChoiceQuestion struct {
    Index     int64  `json:"index"`
	Type      int    `json:"type"`
	Question  string `json:"question"`
	A         string `json:"a"`
	B         string `json:"b"`
	C         string `json:"c"`
	D         string `json:"d"`
	Answer    string `json:"answer"`
}

func NewMCQ(index int64, question string, a string, b string, c string, d string, answer string) MultipleChoiceQuestion {
	return MultipleChoiceQuestion{Index: index, Type: 1, Question: question, A: a, B: b, C: c, D: d, Answer: answer}
}

func (q MultipleChoiceQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// TQ

// With a single answer

type SingleAnswerTranslationQuestion struct {
    Index     int64  `json:"index"`
	Type      int    `json:"type"`
	Given     string `json:"given"`
	Answer    string `json:"answer"`
}

func NewSATQ(index int64, given string, answer string) SingleAnswerTranslationQuestion {
	return SingleAnswerTranslationQuestion{Index: index, Type: 0, Given: given, Answer: answer}
}

func (q SingleAnswerTranslationQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// With multiple answers

type MultipleAnswerTranslationQuestion struct {
    Index     int64    `json:"index"`
	Type      int      `json:"type"`
	Given     string   `json:"given"`
	Answers   []string `json:"answers"`
}

func NewMATQ(index int64, given string, answers []string) MultipleAnswerTranslationQuestion {
	return MultipleAnswerTranslationQuestion{Index: index, Type: 0, Given: given, Answers: answers}
}

func (q MultipleAnswerTranslationQuestion) encode(w http.ResponseWriter) error {
	return json.NewEncoder(w).Encode(q)
}

// RQ

type ReadingQuestion struct {
    Index       int64              `json:"index"`
	Type    	int    			   `json:"type"`
	Extract		string 			   `json:"extract"`
	Questions   []JsonEncodable    `json:"questions"`
}

func NewRQ(index int64, extract string, questions []JsonEncodable) ReadingQuestion {
	return ReadingQuestion{Index: index, Type: 2, Extract: extract, Questions: questions}
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
