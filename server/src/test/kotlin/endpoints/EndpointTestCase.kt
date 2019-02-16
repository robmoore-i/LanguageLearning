package endpoints


import com.fasterxml.jackson.databind.JsonNode
import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert
import org.http4k.core.Headers
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import server.Server

open class EndpointTestCase {
    private val environmentLoader = EnvironmentLoader(System::getenv)
    val environment = environmentLoader.getEnvironment()

    val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)

    private val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
        neo4jDriver,
        environment.imagesPath,
        environment.extractsPath
    )

    private val logger = ServerLogger()

    private val server: Http4kServer = Server(
        environment.serverPort,
        neo4jDatabaseAdaptor,
        environment.frontendPort,
        logger
    )

    private val requester: TestRequester = HttpTestRequester(environment)

    val json = Jackson

    @Before
    fun setUp() {
        server.start()
    }

    @After
    open fun tearDown() {
        server.stop()
        neo4jDriver.session().let { session ->
            session.run("MATCH (n) DETACH DELETE (n)")
            session.run("MATCH (n) DELETE (n)")
            session.close()
        }
    }

    fun assertLessonHasIndex(lessonMetadata: JsonNode, lessonName: String, index: Int) {
        MatcherAssert.assertThat(
            getNodeWithName(lessonMetadata, lessonName)["index"].asInt(),
            CoreMatchers.equalTo(index)
        )
    }

    fun assertHasHeader(response: Response, headerName: String, headerValue: String) {
        MatcherAssert.assertThat(
                headerValue(response.headers, headerName),
                CoreMatchers.equalTo(headerValue)
        )
    }

    fun coursesRequest(): Response {
        return requester.coursesRequest()
    }

    fun lessonRequest(courseName: String, lessonName: String): Response {
        return requester.lessonRequest(courseName, lessonName)
    }

    fun lessonRequestJson(courseName: String, lessonName: String): JsonNode {
        return json.parse(lessonRequest(courseName, lessonName).bodyString())
    }

    fun courseMetadataRequest(courseName: String): Response {
        return requester.courseMetadataRequest(courseName)
    }

    fun courseMetadataRequestJson(courseName: String): JsonNode {
        return json.parse(courseMetadataRequest(courseName).bodyString())
    }

    fun subquestionWithIndex(subquestions: JsonNode, index: Int): JsonNode {
        return subquestions.first { rsq -> rsq["index"].asInt() == index }
    }

    private fun headerValue(headers: Headers, headerName: String): String {
        return headers.first { header -> header.first == headerName }.second!!
    }

    private fun getNodeWithName(lessonMetadata: JsonNode, nodeName: String): JsonNode {
        return lessonMetadata.first { node -> node["name"].toString().unquoted() == nodeName }
    }
}