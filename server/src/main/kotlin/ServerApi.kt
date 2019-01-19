import neo4j.DatabaseAdaptor
import org.http4k.core.Request
import org.http4k.core.Response

class ServerApi(private val legacyServer: LegacyServer, private val neo4jDatabase: DatabaseAdaptor) {
    fun handleCourses(request: Request): Response {
        val courses = neo4jDatabase.allCourses()

        return legacyServer.handleCourses(request)
    }

    fun handleLesson(request: Request): Response {
        return legacyServer.handleLesson(request)
    }

    fun handleCoursemetadata(request: Request): Response {
        return legacyServer.handleCoursemetadata(request)
    }
}