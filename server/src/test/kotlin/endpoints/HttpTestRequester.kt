package endpoints

import com.fasterxml.jackson.databind.JsonNode
import environment.AppEnvironment
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson

class HttpTestRequester(environment: AppEnvironment) : TestRequester {
    private val client = JavaHttpClient()
    private val serverUrl = "http://localhost:${environment.serverPort}"

    val json = Jackson

    override fun courseMetadataRequestJson(courseName: String): JsonNode {
        val response = courseMetadataRequest(courseName)
        return json.parse(response.bodyString())
    }

    override fun courseMetadataRequest(courseName: String): Response {
        val request = Request(Method.GET, "$serverUrl/coursemetadata?course=$courseName")
        return client.invoke(request)
    }

    override fun coursesRequest(): Response {
        val request = Request(Method.GET, "$serverUrl/courses")
        return client.invoke(request)
    }

    override fun lessonRequest(courseName: String, lessonName: String): Response {
        val request = Request(
                Method.POST,
                "$serverUrl/lesson"
        ).body("{\"lessonName\":\"$lessonName\",\"courseName\":\"$courseName\"}")
        return client.invoke(request)
    }

    override fun lessonRequestJson(courseName: String, lessonName: String): JsonNode {
        return json.parse(lessonRequest(courseName, lessonName).bodyString())
    }
}
