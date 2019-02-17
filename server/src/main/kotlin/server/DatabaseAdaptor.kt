package server

import model.Course
import model.CourseMetadata
import model.Lesson

/*Created on 19/01/19. */
interface DatabaseAdaptor {
    fun allCourses(): List<Course>
    fun courseMetadata(courseName: String): CourseMetadata
    fun lesson(courseName: String, lessonName: String): Lesson
}