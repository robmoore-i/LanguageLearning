package server

import model.CourseMetadata
import org.http4k.core.Response

class ServerApi(
        private val jsonEncoder: JsonEncoder,
        private val databaseAdaptor: DatabaseAdaptor,
        private val responseFactory: ServerResponseFactory
) {
    fun courses(): Response {
        val json = jsonEncoder.encodeCourses(databaseAdaptor.allCourses())
        return responseFactory.okResponse(json)
    }

    fun courseMetadata(courseName: String): Response {
        val courseMetadata: CourseMetadata = databaseAdaptor.courseMetadata(courseName)
        val json = jsonEncoder.encodeCourseMetadata(courseMetadata)
        return responseFactory.okResponse(json)
    }

    fun lesson(courseName: String, lessonName: String): Response {
        return try {
            val lesson = databaseAdaptor.lesson(courseName, lessonName)
            val jsonEncodedLesson = jsonEncoder.encodeLesson(lesson)
            responseFactory.okResponse(jsonEncodedLesson)
        } catch (error: IndexOutOfBoundsException) {
            val cause = "NoSuchLesson"
            val jsonEncodedError = "{\"cause\":\"$cause\"}"
            responseFactory.notFoundResponse(jsonEncodedError)
        }
    }
}
