package server

import model.Course
import model.CourseMetadata
import model.Lesson
import model.ReadingSubQuestion

/*Created on 19/01/19. */
interface DatabaseAdaptor {
    fun allCourses(): List<Course>
    fun courseMetadata(courseName: String): CourseMetadata
    fun lessonIndex(courseName: String, lessonName: String): Int
    fun lesson(courseName: String, lessonName: String): Lesson
    fun readingSubQuestions(courseName: String, lessonName: String, lessonIndex: Int): List<ReadingSubQuestion>
    fun readExtract(extractRelativePath: String): String
}