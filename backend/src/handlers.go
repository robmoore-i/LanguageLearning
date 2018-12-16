package main

import (
	"encoding/json"
	"net/http"
	"log"
)

func GetCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:" + FrontendPortStr)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	courses := QueryCourses()

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(courses); err != nil {
		panic(err)
	}
}

func GetLessonNames(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:" + FrontendPortStr)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

    course := r.URL.Query().Get("course")
	lessonNames := QueryLessonNames(course)

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(lessonNames); err != nil {
		panic(err)
	}
}

type LessonRequest struct {
	Name   string  `json:"lessonName"`
}

func GetLesson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:" + FrontendPortStr)
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

func GetCourseMetadata(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:" + FrontendPortStr)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

    courseName := r.URL.Query().Get("course")
	courseMetadata := QueryCourseMetadata(courseName)

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(courseMetadata); err != nil {
		panic(err)
	}
}
