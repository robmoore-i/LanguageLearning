package endpoints


import com.fasterxml.jackson.databind.JsonNode
import environment.AppEnvironment
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted

abstract class EndpointTestCase(
    val environment: AppEnvironment,
    val testDatabaseAdaptor: TestDatabaseAdaptor,
    private val testServerClient: TestServerClient
) {

    private val json = Jackson

    fun assertLessonHasIndex(lessonMetadata: JsonNode, lessonName: String, index: Int) {
        val lesson = lessonMetadata.first { node -> node["name"].toString().unquoted() == lessonName }
        assertThat(lesson["index"].asInt(), equalTo(index))
    }

    fun assertHasHeader(response: Response, headerName: String, expectedHeaderValue: String) {
        val responseHeaderValue = response.headers.first { header -> header.first == headerName }.second!!
        assertThat(responseHeaderValue, equalTo(expectedHeaderValue))
    }

    fun coursesRequest(): Response {
        return testServerClient.coursesRequest()
    }

    fun coursesJson(): JsonNode {
        return extractJsonBody(coursesRequest())
    }

    fun lessonRequest(courseName: String, lessonName: String): Response {
        return testServerClient.lessonRequest(courseName, lessonName)
    }

    fun lessonRequestJson(courseName: String, lessonName: String): JsonNode {
        return extractJsonBody(lessonRequest(courseName, lessonName))
    }

    fun courseMetadataRequest(courseName: String): Response {
        return testServerClient.courseMetadataRequest(courseName)
    }

    fun courseMetadataRequestJson(courseName: String): JsonNode {
        return extractJsonBody(courseMetadataRequest(courseName))
    }

    fun extractJsonBody(response: Response) = json.parse(response.bodyString())
}