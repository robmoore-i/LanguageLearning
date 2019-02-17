package server

import model.Course
import model.CourseMetadata
import model.Lesson

interface ServerApi {
    fun courses(): List<Course>
    fun courseMetadata(courseName: String): CourseMetadata
    fun lesson(courseName: String, lessonName: String): Lesson
}