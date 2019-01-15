import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response

class LegacyServer(private val legacyServerPort: Int) {
    private val client = JavaHttpClient()

    fun handleCourses(request: Request): Response {
        return client.invoke(Request(Method.GET, "http://localhost:$legacyServerPort/courses"))
    }

    fun handleLesson(request: Request): Response {
        val json = request.bodyString()
        return client.invoke(Request(Method.POST, "http://localhost:$legacyServerPort/lesson").body(json))
    }

    fun handleCoursemetadata(request: Request): Response {
        val courseName: String = request.query("course") ?: throw Exception("No course query parameter in request for the coursemetadata/ endpoint")
        return client.invoke(Request(Method.GET, "http://localhost:$legacyServerPort/coursemetadata").query("course", courseName))
    }
}
