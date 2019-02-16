package endpoints

import org.http4k.core.Response

interface TestRequester {
    fun courseMetadataRequest(courseName: String): Response
    fun coursesRequest(): Response
    fun lessonRequest(courseName: String, lessonName: String): Response
}
