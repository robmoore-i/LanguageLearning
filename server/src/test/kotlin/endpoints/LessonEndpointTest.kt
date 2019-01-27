package endpoints

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

class LessonEndpointTest {
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
    fun canGetRqWithInlineExtract() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "c", image: "img.png"})-[:HAS_TOPIC_LESSON {index: 0}]->(l:TopicLesson {name: "RQ"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(rq:Question:ReadingQuestion {extractInline: "inline-extract"})
                CREATE (rq)-[:HAS_SUBQUESTION {index: 0}]->(rsq:ReadingSubQuestion {given:"What does 'საქართველო' mean in English?", answer:"Georgia"})
                RETURN l,rq,rsq,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = lessonRequestJson("RQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val rq = questions[0]
        assertThat(rq["type"].asInt(), equalTo(2))
        assertThat(rq["index"].asInt(), equalTo(0))
        assertThat(rq["extract"].toString().unquoted(), equalTo("inline-extract"))
    }

    @Test
    fun canGetAnRsq() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "c", image: "img.png"})-[:HAS_TOPIC_LESSON {index: 0}]->(l:TopicLesson {name: "RQ"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(rq:Question:ReadingQuestion {extractInline: "inline-extract"})
                CREATE (rq)-[:HAS_SUBQUESTION {index: 0}]->(rsq:ReadingSubQuestion {given:"What does 'საქართველო' mean in English?", answer:"Georgia"})
                RETURN l,rq,rsq,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = lessonRequestJson("RQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val rq = questions[0]
        val subquestions = rq["questions"]
        assertThat(subquestions.size(), equalTo(1))

        val rsq = subquestions[0]
        assertThat(rsq["given"].toString().unquoted(), equalTo("What does 'საქართველო' mean in English?"))
        assertThat(rsq["answer"].toString().unquoted(), equalTo("Georgia"))
    }

    @Test
    fun canGetRqWithFileExtract() {
        File(Paths.get(environment.extractsPath, "test.txt").toUri()).writeText("file-extract")

        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "c", image: "img.png"})-[:HAS_TOPIC_LESSON {index: 0}]->(l:TopicLesson {name: "RQ"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(rq:Question:ReadingQuestion {extractFile: "test.txt"})
                RETURN l,rq,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = lessonRequestJson("RQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val rq = questions[0]
        assertThat(rq["type"].asInt(), equalTo(2))
        assertThat(rq["index"].asInt(), equalTo(0))
        assertThat(rq["extract"].toString().unquoted(), equalTo("file-extract"))
    }

    private fun lessonRequest(lessonName: String): Response {
        val request = Request(Method.POST, "$serverUrl/lesson").body("{\"lessonName\":\"$lessonName\"}")
        return client.invoke(request)
    }

    private fun lessonRequestJson(lessonName: String): JsonNode {
        return json.parse(lessonRequest(lessonName).bodyString())
    }
}