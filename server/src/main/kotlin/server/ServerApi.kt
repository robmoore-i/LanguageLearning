package server

import model.Course
import model.CourseMetadata
import model.Lesson

class ServerApi(private val databaseAdaptor: DatabaseAdaptor) {
    fun courses(): List<Course> {
        return databaseAdaptor.allCourses()
    }

    fun courseMetadata(courseName: String): CourseMetadata {
        return databaseAdaptor.courseMetadata(courseName)
    }

    fun lesson(courseName: String, lessonName: String): Lesson {
        try {
            return databaseAdaptor.lesson(courseName, lessonName)
        } catch (error: IndexOutOfBoundsException) {
            throw NoSuchLessonException(error)
        }
    }
}

class NoSuchLessonException(cause: Throwable) : Throwable(cause)
