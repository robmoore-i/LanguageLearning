package server

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted

class HttpRequestHandler(private val serverApi: ServerApi, private val httpResponseFactory: ServerResponseFactory) {
    private val json = Jackson

    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        val courses = serverApi.courses()
        return httpResponseFactory.ok(courses)
    }

    fun handleCoursemetadata(request: Request): Response {
        val courseName = request.query("course") ?: return httpResponseFactory.badRequest("MissingQueryParam: course")

        val courseMetadata = serverApi.courseMetadata(courseName)
        return httpResponseFactory.ok(courseMetadata)
    }

    fun handleLesson(request: Request): Response {
        val jsonNode: JsonNode = json.parse(request.bodyString())
        val courseName = jsonNode["courseName"].toString().unquoted()
        val lessonName = jsonNode["lessonName"].toString().unquoted()

        return try {
            val lesson = serverApi.lesson(courseName, lessonName)
            return httpResponseFactory.ok(lesson)
        } catch (error: NoSuchLessonException) {
            httpResponseFactory.notFound("NoSuchLesson")
        }
    }
}