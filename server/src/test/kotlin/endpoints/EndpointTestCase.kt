package endpoints


import com.fasterxml.jackson.databind.JsonNode
import environment.AppEnvironment
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import server.Server

abstract class EndpointTestCase(
    val environment: AppEnvironment,
    val testDatabaseAdaptor: TestDatabaseAdaptor,
    private val testRequester: TestRequester,
    private val server: Server
) {

    val json = Jackson

    @Before
    fun setUp() {
        server.start()
    }

    @After
    open fun tearDown() {
        server.stop()
        testDatabaseAdaptor.clearDatabase()
    }

    fun assertLessonHasIndex(lessonMetadata: JsonNode, lessonName: String, index: Int) {
        val lesson = lessonMetadata.first { node -> node["name"].toString().unquoted() == lessonName }
        assertThat(lesson["index"].asInt(), equalTo(index))
    }

    fun assertHasHeader(response: Response, headerName: String, expectedHeaderValue: String) {
        val responseHeaderValue = response.headers.first { header -> header.first == headerName }.second!!
        assertThat(responseHeaderValue, equalTo(expectedHeaderValue))
    }

    fun coursesRequest(): Response {
        return testRequester.coursesRequest()
    }

    fun coursesJson(): JsonNode {
        return extractJsonBody(coursesRequest())
    }

    fun lessonRequest(courseName: String, lessonName: String): Response {
        return testRequester.lessonRequest(courseName, lessonName)
    }

    fun lessonRequestJson(courseName: String, lessonName: String): JsonNode {
        return extractJsonBody(lessonRequest(courseName, lessonName))
    }

    fun courseMetadataRequest(courseName: String): Response {
        return testRequester.courseMetadataRequest(courseName)
    }

    fun courseMetadataRequestJson(courseName: String): JsonNode {
        return extractJsonBody(courseMetadataRequest(courseName))
    }

    private fun extractJsonBody(response: Response) = json.parse(response.bodyString())
}