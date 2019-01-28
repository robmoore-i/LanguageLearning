package endpoints

import com.fasterxml.jackson.databind.JsonNode
import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Headers
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import org.junit.Test
import server.Server

/*Created on 19/01/19. */
class CoursesEndpointTest {
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
    }

    @Before
    fun setUp() {
        server.start()
    }

    @Test
    fun givesOkResponse() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
                CREATE (french:Course {name: "French", image: "flagFrance.png"})
                CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
                RETURN georgian,french,german;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = coursesRequest()

        assertThat(response.status.code, equalTo(200))
    }

    @Test
    fun givesAccessControlAllowOriginCorsHeader() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
                CREATE (french:Course {name: "French", image: "flagFrance.png"})
                CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
                RETURN georgian,french,german;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = coursesRequest()

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

        val jsonNode = extractCourseFromJson("svgtest")

        assertCourseHasProperties(
            jsonNode,
            "svgtest",
            "svg",
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"900\" height=\"600\" viewBox=\"0 0 300 200\">\n<defs>\n<g id=\"smallcross\"><clipPath id=\"vclip\"><path d=\"M-109,104 a104,104 0 0,0 0,-208 H109 a104,104 0 0,0 0,208 z\"/></clipPath><path id=\"varm\" d=\"M-55,74 a55,55 0 0,1 110,0 V-74 a55,55 0 0,1 -110,0 z\" clip-path=\"url(#vclip)\"/>\n<use xlink:href=\"#varm\" transform=\"rotate(90)\"/></g>\n</defs>\n<rect width=\"300\" height=\"200\" style=\"fill:#fff\"/>\n<path d=\"m 130,0 0,80 -130,0 L 0,120 l 130,0 0,80 40,0 0,-80 130,0 0,-40 -130,0 L 170,0 130,0 z\" style=\"fill:#ff0000\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,160.55)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,160.55)\" fill=\"#f00\"/>\n</svg>"
        )
    }

    @Test
    fun canGetAPngCourseIcon() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "pngtest", image: "flagFrance.png"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(l1:TopicLesson {name: "l3"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(l2:TopicLesson {name: "l2"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(l3:TopicLesson {name: "l1"})
                RETURN c,l1,l2,l3;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val jsonNode = extractCourseFromJson("pngtest")

        assertCourseHasProperties(
            jsonNode,
            "pngtest",
            "png",
            "iVBORw0KGgoAAAANSUhEUgAAB9AAAAU1BAMAAAC5AEJSAAAAD1BMVEUAI5XtKTlacbrzdX/////aEUguAAAAAWJLR0QEj2jZUQAACxVJREFUeNrt00ERACAMBDGKEh74l1JL1MT9SCTszNYi5x4NYl5rkLMlAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9ElAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9ElAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOnxpAOPYDHtQJb3+AAAAAElFTkSuQmCC"
        )
    }

    @Test
    fun canGetAJpgCourseIcon() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "jpgtest", image: "flagGermany.jpg"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(l1:TopicLesson {name: "l3"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(l2:TopicLesson {name: "l2"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(l3:TopicLesson {name: "l1"})
                RETURN c,l1,l2,l3;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val jsonNode = extractCourseFromJson("jpgtest")

        assertCourseHasProperties(
            jsonNode,
            "jpgtest",
            "jpg",
            "/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gNzAK/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8AAEQgCZgQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8ZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAorW/4R+f8A57R/rR/wj8//AD2j/Wsfb0+56X9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wN6iiivHP0YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAor1j/hHtH/AOgbb/8AfFH/AAj2j/8A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gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z"
        )
    }

    private fun coursesRequest(): Response {
        val request = Request(Method.GET, "$serverUrl/courses")
        return client.invoke(request)
    }

    private fun extractCourseFromJson(courseName: String): JsonNode {
        val response = coursesRequest()
        val responseJson = json.parse(response.bodyString())
        return responseJson.first { node -> node["name"].toString().unquoted() == courseName }
    }

    private fun assertCourseHasProperties(
        jsonNode: JsonNode,
        expectedCourseName: String,
        expectedCourseImageType: String,
        expectedImageStringBytes: String
    ) {
        assertThat(jsonNode["name"].toString().unquoted(), equalTo(expectedCourseName))
        assertThat(jsonNode["imageType"].toString().unquoted(), equalTo(expectedCourseImageType))
        assertThat(jsonNode["image"].toString().unquoted().replace("\\n", "\n"), equalTo(expectedImageStringBytes))
    }
}

fun headerValue(headers: Headers, headerName: String): String {
    return headers.first { header -> header.first == headerName }.second!!
}

fun assertHasHeader(response: Response, headerName: String, headerValue: String) {
    assertThat(
        headerValue(response.headers, headerName),
        equalTo(headerValue)
    )
}
