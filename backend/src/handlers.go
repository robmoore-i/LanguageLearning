package main

import (
	"encoding/json"
	"net/http"
)

func GetLessonNames(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	lessonNames := QueryLessonNames()

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(lessonNames); err != nil {
		panic(err)
	}
}

func GetLesson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	tq := NewTQ("hello", "გამარჯობა")
	mcq := NewMCQ("sounds like \"i\" in English", "ა", "ო", "უ", "ი", "d")

	questions := [...]JsonEncodable{tq, mcq}

	l := Lesson{Name:"hello", Questions: questions}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(l); err != nil {
		panic(err)
	}
}