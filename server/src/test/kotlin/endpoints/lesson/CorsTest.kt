package endpoints.lesson

import endpoints.assertHasHeader
import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.junit.After
import org.junit.Before
import org.junit.Test
import server.LegacyServer
import server.Server

class CorsTest {
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
    fun givesAccessControlAllowOriginCorsHeader() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (hello:TopicLesson {name: "lesson"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
                CREATE (hello)-[:HAS_QUESTION {index: 0}]->(letterA:Question:MultipleChoiceQuestion {question: "sounds like \"a\" in English", a: "მ",b:"ბ", c:"ა", answer: "c"})
                RETURN hello,letterA,c;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = lessonRequest("lesson")

        assertHasHeader(
            response,
            "Access-Control-Allow-Origin",
            "http://localhost:${environment.frontendPort}"
        )
        assertHasHeader(
            response,
            "Access-Control-Allow-Headers",
            "Content-Type"
        )
        assertHasHeader(
            response,
            "Content-Type",
            "application/json;charset=utf-8"
        )
    }

    private fun lessonRequest(lessonName: String): Response {
        val request = Request(Method.POST, "$serverUrl/lesson").body("{\"lessonName\":\"$lessonName\"}")
        return client.invoke(request)
    }
}