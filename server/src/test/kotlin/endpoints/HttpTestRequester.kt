package endpoints

import environment.AppEnvironment
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response

class HttpTestRequester(environment: AppEnvironment) : TestRequester {
    private val client = JavaHttpClient()
    private val serverUrl = "http://localhost:${environment.serverPort}"

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
}
