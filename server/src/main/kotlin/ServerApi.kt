import com.fasterxml.jackson.databind.JsonNode
import neo4j.DatabaseAdaptor
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK

class ServerApi(
    private val legacyServer: LegacyServer,
    private val neo4jDatabase: DatabaseAdaptor,
    private val frontendPort: Int
) {
    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        val courses: List<JsonNode> = neo4jDatabase.allCourses()

        val stringBuilder = StringBuilder().append("[")
        for (course in courses) {
            stringBuilder.append(course.toString()).append(",")
        }
        val json = stringBuilder.toString().dropLast(1) + "]"

        println(json)

        return Response(OK)
            .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
            .header("Access-Control-Allow-Headers", "Content-Type")
            .header("Content-Type", "application/json; charset=UTF-8")
            .body(json)
    }

    fun handleLesson(request: Request): Response {
        return legacyServer.handleLesson(request)
    }

    fun handleCoursemetadata(request: Request): Response {
        return legacyServer.handleCoursemetadata(request)
    }
}