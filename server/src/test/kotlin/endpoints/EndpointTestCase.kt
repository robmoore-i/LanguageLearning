package endpoints


import com.fasterxml.jackson.databind.JsonNode
import environment.AppEnvironment
import environment.EnvironmentLoader
import logger.ServerLogger
import model.Course
import model.CourseMetadata
import model.Lesson
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import server.Server

open class EndpointTestCase {
    val environment: AppEnvironment
    val testDatabaseAdaptor: TestDatabaseAdaptor
    private val requester: TestRequester
    private val server: Server

    val json = Jackson

    init {
        val environmentLoader = EnvironmentLoader(System::getenv)
        environment = environmentLoader.getEnvironment()
        testDatabaseAdaptor = object : TestDatabaseAdaptor {
            val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)
            val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
                    neo4jDriver,
                    environment.imagesPath,
                    environment.extractsPath
            )

            override fun allCourses(): List<Course> {
                return neo4jDatabaseAdaptor.allCourses()
            }

            override fun courseMetadata(courseName: String): CourseMetadata {
                return neo4jDatabaseAdaptor.courseMetadata(courseName)
            }

            override fun lesson(courseName: String, lessonName: String): Lesson {
                return neo4jDatabaseAdaptor.lesson(courseName, lessonName)
            }

            override fun clearDatabase() {
                neo4jDatabaseAdaptor.clearDatabase()
            }

            override fun runQuery(query: String) {
                neo4jDriver.session().let { session ->
                    session.run(query)
                    session.close()
                }
            }
        }

        requester = HttpTestRequester(environment)

        server = Server(
            environment.serverPort,
            testDatabaseAdaptor,
            environment.frontendPort,
            ServerLogger()
        )
    }

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
        return requester.coursesRequest()
    }

    fun coursesJson(): JsonNode {
        return extractJsonBody(coursesRequest())
    }

    fun lessonRequest(courseName: String, lessonName: String): Response {
        return requester.lessonRequest(courseName, lessonName)
    }

    fun lessonRequestJson(courseName: String, lessonName: String): JsonNode {
        return extractJsonBody(lessonRequest(courseName, lessonName))
    }

    fun courseMetadataRequest(courseName: String): Response {
        return requester.courseMetadataRequest(courseName)
    }

    fun courseMetadataRequestJson(courseName: String): JsonNode {
        return extractJsonBody(courseMetadataRequest(courseName))
    }

    private fun extractJsonBody(response: Response) = json.parse(response.bodyString())
}