package main

import (
	"encoding/json"
	"net/http"
	"log"
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

type LessonRequest struct {
	Name      string          `json:"lessonName"`
}

func GetLesson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	decoder := json.NewDecoder(r.Body)
	var lessonRequest LessonRequest
	err := decoder.Decode(&lessonRequest)
	if err != nil {
		log.Printf("Couldn't decode POST request body for /lesson endpoint: %#v", r.Body)
		panic("handlers:GetLesson")
	}

	lesson := QueryLesson(lessonRequest.Name)

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(lesson); err != nil {
		panic(err)
	}
}