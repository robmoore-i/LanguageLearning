package main

import (
	"encoding/json"
	"net/http"
	"github.com/gorilla/mux"
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

	vars := mux.Vars(r)
	lessonName := vars["lessonName"]
	lesson := QueryLesson(lessonName)

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(lesson); err != nil {
		panic(err)
	}
}