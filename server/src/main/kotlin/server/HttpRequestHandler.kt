package server

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted

class HttpRequestHandler(private val serverApi: ServerApi, private val httpResponseFactory: HttpResponseFactory) {
    private val json = Jackson
    private val jsonEncoder = JsonEncoder()

    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        val courses = serverApi.courses()
        val coursesJson = jsonEncoder.encodeCourses(courses)
        return httpResponseFactory.ok(coursesJson)
    }

    fun handleCoursemetadata(request: Request): Response {
        val courseName = request.query("course") ?: throw MissingQueryParameter("course")
        val courseMetadata = serverApi.courseMetadata(courseName)
        return httpResponseFactory.ok(jsonEncoder.encode(courseMetadata))
    }

    fun handleLesson(request: Request): Response {
        val jsonNode: JsonNode = json.parse(request.bodyString())
        val courseName = jsonNode["courseName"].toString().unquoted()
        val lessonName = jsonNode["lessonName"].toString().unquoted()

        return try {
            val lesson = serverApi.lesson(courseName, lessonName)
            return httpResponseFactory.ok(jsonEncoder.encode(lesson))
        } catch (error: NoSuchLessonException) {
            httpResponseFactory.notFound("NoSuchLesson")
        }
    }
}

class MissingQueryParameter(missingParameterName: String) : Throwable("Missing query parameter: $missingParameterName")
