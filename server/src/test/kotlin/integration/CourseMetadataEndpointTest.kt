package integration


import com.fasterxml.jackson.databind.JsonNode
import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import org.junit.Test
import server.LegacyServer
import server.Server

class CourseMetadataEndpointTest {
    private val environmentLoader = EnvironmentLoader(System::getenv)
    private val environment = environmentLoader.getEnvironment()
    private val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)
    private val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
        neo4jDriver,
        environment.imagesPath,
        environment.extractsPath
    )

    private val legacyServer = LegacyServer(environment.legacyServerPort)
    private val logger = ServerLogger()

    private val server: Http4kServer = Server(
        environment.serverPort,
        legacyServer,
        neo4jDatabaseAdaptor,
        environment.frontendPort,
        logger
    )

    private val client = JavaHttpClient()
    private val serverUrl = "http://localhost:${environment.serverPort}"

    private val json = Jackson

    @After
    fun tearDown() {
        server.stop()
        neo4jDriver.session().let { session ->
            session.run("MATCH (n) DETACH DELETE (n)")
            session.run("MATCH (n) DELETE (n)")
            session.close()
        }
    }

    @Before
    fun setUp() {
        server.start()
    }

    @Test
    fun canGetLessonOrderForACourse() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "Course", image: "flagGeorgia.svg"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
                RETURN hello,whatAreYouCalled,colours,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = courseMetadataRequestJson("Course")
        val lessonMetadata = responseJson["lessonMetadata"]

        val helloLesson = getNodeWithName(lessonMetadata, "Hello")
        val whatAreYouCalledLesson = getNodeWithName(lessonMetadata, "What are you called?")
        val coloursLesson = getNodeWithName(lessonMetadata, "Colours")

        assertLessonHasIndex(helloLesson, 0)
        assertLessonHasIndex(whatAreYouCalledLesson, 1)
        assertLessonHasIndex(coloursLesson, 2)
    }

    private fun assertLessonHasIndex(lessonNode: JsonNode, index: Int) {
        assertThat(lessonNode["index"].asInt(), equalTo(index))
    }

    private fun getNodeWithName(
        lessonMetadata: JsonNode,
        nodeName: String
    ) = lessonMetadata.first { node -> node["name"].toString().unquoted() == nodeName }

    private fun courseMetadataRequest(courseName: String): Response {
        val request = Request(Method.GET, "$serverUrl/coursemetadata?course=$courseName")
        return client.invoke(request)
    }

    private fun courseMetadataRequestJson(courseName: String): JsonNode {
        val response = courseMetadataRequest(courseName)
        return json.parse(response.bodyString())
    }
}