package endpoints.lesson

import com.fasterxml.jackson.databind.JsonNode
import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.http4k.unquoted
import org.junit.After
import org.junit.Assert.assertFalse
import org.junit.Before
import org.junit.Test
import server.Server
import java.io.File
import java.nio.file.Paths

class TranslationQuestionsTest {
    private val environmentLoader = EnvironmentLoader(System::getenv)
    private val environment = environmentLoader.getEnvironment()
    private val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)
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
    fun canGetTq() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (l:TopicLesson {name: "TQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})
                RETURN l,tq,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = lessonRequestJson("TQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val tq = questions[0]
        assertThat(tq["type"].asInt(), equalTo(0))
        assertThat(tq["index"].asInt(), equalTo(0))
        assertThat(tq["given"].toString().unquoted(), equalTo("What are you called?"))
        assertThat(tq["answer"].toString().unquoted(), equalTo("შენ რა გქვია?"))
    }

    @Test
    fun canGetTqWithMultipleAnswers() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (l:TopicLesson {name: "TQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "Blue", answers: ["ლურჯი", "ცისფერი"]})
                RETURN l,tq,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = lessonRequestJson("TQ")
        val questions = responseJson["questions"]

        val tq = questions[0]
        val answers = tq["answers"].map { answer -> answer.toString().unquoted() }
        assertThat(answers, hasItem("ლურჯი"))
        assertThat(answers, hasItem("ცისფერი"))
        assertFalse(tq.has("answer"))
    }

    private fun lessonRequest(lessonName: String): Response {
        val request = Request(Method.POST, "$serverUrl/lesson").body("{\"lessonName\":\"$lessonName\"}")
        return client.invoke(request)
    }

    private fun lessonRequestJson(lessonName: String): JsonNode {
        return json.parse(lessonRequest(lessonName).bodyString())
    }
}