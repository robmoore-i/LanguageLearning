package server

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted

class ServerHttpApi(private val serverApi: ServerApi) {
    private val json = Jackson

    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        return serverApi.courses()
    }

    fun handleCoursemetadata(request: Request): Response {
        val courseName = request.query("course") ?: throw MissingQueryParameter("course")
        return serverApi.courseMetadata(courseName)
    }

    fun handleLesson(request: Request): Response {
        val jsonNode: JsonNode = json.parse(request.bodyString())
        val courseName = jsonNode["courseName"].toString().unquoted()
        val lessonName = jsonNode["lessonName"].toString().unquoted()
        return serverApi.lesson(courseName, lessonName)
    }
}

class MissingQueryParameter(missingParameterName: String) : Throwable("Missing query parameter: $missingParameterName")
