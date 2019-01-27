package endpoints.lesson

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
import java.io.File
import java.nio.file.Paths

class MultipleChoiceQuestionsTest {
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
        File(Paths.get(environment.extractsPath, "test.txt").toUri()).delete()
    }

    @Before
    fun setUp() {
        server.start()
    }

    @Test
    fun canGetMcq() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (hello:TopicLesson {name: "MCQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
                CREATE (hello)-[:HAS_QUESTION {index: 0}]->(letterA:Question:MultipleChoiceQuestion {question: "sounds like \"a\" in English", a: "მ",b:"ბ", c:"გ", d:"ა", answer: "d"})
                RETURN hello,letterA,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = lessonRequestJson("MCQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val mcq = questions[0]
        assertThat(mcq["type"].asInt(), equalTo(1))
        assertThat(mcq["index"].asInt(), equalTo(0))
        assertThat(mcq["question"].toString().unquoted(), equalTo("sounds like \"a\" in English"))
        assertThat(mcq["a"].toString().unquoted(), equalTo("მ"))
        assertThat(mcq["b"].toString().unquoted(), equalTo("ბ"))
        assertThat(mcq["c"].toString().unquoted(), equalTo("გ"))
        assertThat(mcq["d"].toString().unquoted(), equalTo("ა"))
    }

    private fun lessonRequest(lessonName: String): Response {
        val request = Request(Method.POST, "$serverUrl/lesson").body("{\"lessonName\":\"$lessonName\"}")
        return client.invoke(request)
    }

    private fun lessonRequestJson(lessonName: String): JsonNode {
        return json.parse(lessonRequest(lessonName).bodyString())
    }
}