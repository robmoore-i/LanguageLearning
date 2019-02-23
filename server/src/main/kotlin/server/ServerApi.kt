package server

import model.CourseMetadata

class ServerApi(private val databaseAdaptor: DatabaseAdaptor) {
    private val jsonEncoder = JsonEncoder()

    fun courses(): String {
        return jsonEncoder.encodeCourses(databaseAdaptor.allCourses())
    }

    fun courseMetadata(courseName: String): String {
        val courseMetadata: CourseMetadata = databaseAdaptor.courseMetadata(courseName)
        return jsonEncoder.encodeCourseMetadata(courseMetadata)
    }

    fun lesson(courseName: String, lessonName: String): String {
        try {
            val lesson = databaseAdaptor.lesson(courseName, lessonName)
            return jsonEncoder.encodeLesson(lesson)
        } catch (error: IndexOutOfBoundsException) {
            throw NoSuchLessonException(error)
        }
    }
}

class NoSuchLessonException(cause: Throwable) : Throwable(cause)
