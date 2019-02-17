package server

import model.Course
import model.CourseMetadata
import model.Lesson

class DatabaseServingApi(private val databaseAdaptor: DatabaseAdaptor) : ServerApi {
    override fun courses(): List<Course> {
        return databaseAdaptor.allCourses()
    }

    override fun courseMetadata(courseName: String): CourseMetadata {
        return databaseAdaptor.courseMetadata(courseName)
    }

    override fun lesson(courseName: String, lessonName: String): Lesson {
        try {
            return databaseAdaptor.lesson(courseName, lessonName)
        } catch (error: IndexOutOfBoundsException) {
            throw NoSuchLessonException(error)
        }
    }
}

class NoSuchLessonException(cause: Throwable) : Throwable(cause) {
    constructor() : this(Throwable())
}
