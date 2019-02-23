package server

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted

class HttpRequestHandler(private val serverApi: ServerApi, private val httpResponseFactory: HttpResponseFactory) {
    private val json = Jackson

    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        return httpResponseFactory.okResponse(serverApi.courses())
    }

    fun handleCoursemetadata(request: Request): Response {
        val courseName = request.query("course") ?: throw MissingQueryParameter("course")
        return httpResponseFactory.okResponse(serverApi.courseMetadata(courseName))
    }

    fun handleLesson(request: Request): Response {
        val jsonNode: JsonNode = json.parse(request.bodyString())
        val courseName = jsonNode["courseName"].toString().unquoted()
        val lessonName = jsonNode["lessonName"].toString().unquoted()

        return try {
            return httpResponseFactory.okResponse(serverApi.lesson(courseName, lessonName))
        } catch (error: NoSuchLessonException) {
            val cause = "NoSuchLesson"
            val jsonEncodedError = "{\"cause\":\"$cause\"}"
            httpResponseFactory.notFoundResponse(jsonEncodedError)
        }
    }
}

class MissingQueryParameter(missingParameterName: String) : Throwable("Missing query parameter: $missingParameterName")
