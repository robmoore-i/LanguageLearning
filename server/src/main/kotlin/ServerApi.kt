import org.http4k.core.Request
import org.http4k.core.Response

class ServerApi(private val legacyServer: LegacyServer) {
    fun handleCourses(request: Request): Response {
        return legacyServer.handleCourses(request)
    }

    fun handleLesson(request: Request): Response {
        return legacyServer.handleLesson(request)
    }

    fun handleCoursemetadata(request: Request): Response {
        return legacyServer.handleCoursemetadata(request)
    }
}