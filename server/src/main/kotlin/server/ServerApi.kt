package server

import model.CourseMetadata
import org.http4k.core.Response

class ServerApi(
        private val databaseAdaptor: DatabaseAdaptor,
        private val serverResponseFactory: ServerResponseFactory
) {
    private val jsonEncoder = JsonEncoder()

    fun courses(): Response {
        val json = jsonEncoder.encodeCourses(databaseAdaptor.allCourses())
        return serverResponseFactory.okResponse(json)
    }

    fun courseMetadata(courseName: String): Response {
        val courseMetadata: CourseMetadata = databaseAdaptor.courseMetadata(courseName)
        val json = jsonEncoder.encodeCourseMetadata(courseMetadata)
        return serverResponseFactory.okResponse(json)
    }

    fun lesson(courseName: String, lessonName: String): Response {
        return try {
            val lesson = databaseAdaptor.lesson(courseName, lessonName)
            val jsonEncodedLesson = jsonEncoder.encodeLesson(lesson)
            serverResponseFactory.okResponse(jsonEncodedLesson)
        } catch (error: IndexOutOfBoundsException) {
            val cause = "NoSuchLesson"
            val jsonEncodedError = "{\"cause\":\"$cause\"}"
            serverResponseFactory.notFoundResponse(jsonEncodedError)
        }
    }
}
