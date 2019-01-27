package server

import model.CourseMetadata
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK

class ServerApi(
    private val legacyServer: LegacyServer,
    private val databaseAdaptor: DatabaseAdaptor,
    private val frontendPort: Int
) {
    private val jsonEncoder = JsonEncoder()

    fun handleCourses(@Suppress("UNUSED_PARAMETER") request: Request): Response {
        val json = jsonEncoder.encodeCourses(databaseAdaptor.allCourses())
        return okResponse(json)
    }

    fun handleCoursemetadata(request: Request): Response {
        val courseName = request.query("course") ?: throw MissingQueryParameter("course")
        val courseMetadata: CourseMetadata = databaseAdaptor.courseMetadata(courseName)
        val json = jsonEncoder.encodeCourseMetadata(courseMetadata)
        return okResponse(json)
    }

    fun handleLesson(request: Request): Response {
        return legacyServer.handleLesson(request)
    }

    private fun okResponse(json: String): Response {
        return Response(OK)
            .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
            .header("Access-Control-Allow-Headers", "Content-Type")
            .header("Content-Type", "application/json; charset=UTF-8")
            .body(json)
    }
}

class MissingQueryParameter(missingParameterName: String) : Throwable("Missing query parameter: $missingParameterName")
