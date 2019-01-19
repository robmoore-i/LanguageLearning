import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response

open class LegacyServer(legacyServerPort: Int) {
    private val client = JavaHttpClient()
    private val legacyServerUrl = "http://localhost:$legacyServerPort"

    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        return client.invoke(Request(Method.GET, "$legacyServerUrl/courses"))
    }

    fun handleLesson(request: Request): Response {
        val json = request.bodyString()
        return client.invoke(Request(Method.POST, "$legacyServerUrl/lesson").body(json))
    }

    open fun handleCoursemetadata(request: Request): Response {
        val courseName: String = request.query("course") ?: throw Exception("No course query parameter in request for the coursemetadata/ endpoint")
        return client.invoke(Request(Method.GET, "$legacyServerUrl/coursemetadata").query("course", courseName))
    }
}
