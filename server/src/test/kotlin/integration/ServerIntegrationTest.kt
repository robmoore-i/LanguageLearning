package integration

import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import org.junit.Test
import server.LegacyServer
import server.Server

/*Created on 19/01/19. */
class ServerIntegrationTest {
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
    fun canGetAnSvgCourseIcon() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (georgian:Course {name: "svgtest", image: "flagGeorgia.svg"})
                CREATE (georgian)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
                CREATE (georgian)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
                CREATE (georgian)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
                RETURN georgian,hello,whatAreYouCalled,colours;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val request = Request(Method.GET, "$serverUrl/courses")
        val response = client.invoke(request)
        val responseJson = json.parse(response.bodyString())

        val jsonNode = responseJson[0]
        assertThat(jsonNode["name"].toString().unquoted(), equalTo("svgtest"))
        assertThat(jsonNode["imageType"].toString().unquoted(), equalTo("svg"))

        val actualImageStringBytes = jsonNode["image"].toString().unquoted()
            .replace("\\n", "\n") // Absoluetly fuming

        assertThat(
            actualImageStringBytes, equalTo(
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"900\" height=\"600\" viewBox=\"0 0 300 200\">\n<defs>\n<g id=\"smallcross\"><clipPath id=\"vclip\"><path d=\"M-109,104 a104,104 0 0,0 0,-208 H109 a104,104 0 0,0 0,208 z\"/></clipPath><path id=\"varm\" d=\"M-55,74 a55,55 0 0,1 110,0 V-74 a55,55 0 0,1 -110,0 z\" clip-path=\"url(#vclip)\"/>\n<use xlink:href=\"#varm\" transform=\"rotate(90)\"/></g>\n</defs>\n<rect width=\"300\" height=\"200\" style=\"fill:#fff\"/>\n<path d=\"m 130,0 0,80 -130,0 L 0,120 l 130,0 0,80 40,0 0,-80 130,0 0,-40 -130,0 L 170,0 130,0 z\" style=\"fill:#ff0000\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,160.55)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,160.55)\" fill=\"#f00\"/>\n</svg>"
            )
        )
    }
}