package integration

import environment.EnvironmentLoader
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

/*Created on 19/01/19. */
class Neo4jDriverTest {
    private val environmentLoader = EnvironmentLoader(System::getenv)
    private val appEnvironment = environmentLoader.getEnvironment()
    private val neo4jUser = appEnvironment.neo4jUser
    private val neo4jPassword = appEnvironment.neo4jPassword
    private val neo4jPort = appEnvironment.neo4jPort

    private val neo4jDriver = Neo4jDriver(neo4jUser, neo4jPassword, neo4jPort)

    @Test
    fun canQueryForGeorgianCourseFromNeo4j() {
        val records = neo4jDriver.query("MATCH (c:Course) RETURN c")

        val courseNames = records.map { r -> r[0]["name"].toString() }

        assertThat(courseNames, hasItem("\"Georgian\""))
    }

    @Test
    fun canQueryForGeorgianHelloLessonFromNeo4j() {
        val records = neo4jDriver.queryWithParams(
            "MATCH (tl:TopicLesson {name: {name}})-[r:HAS_QUESTION]->(q) RETURN q,r.index",
            mapOf(
                "name" to "Peace Corps Georgia: Hello"
            )
        )

        val tqGivenValues = records
            .filter { r -> r[0].asNode().hasLabel("TranslationQuestion") }
            .map { r -> r[0]["given"].toString() }

        assertThat(tqGivenValues, hasItem("\"Hello\""))
    }
}