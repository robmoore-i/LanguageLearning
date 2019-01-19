package integration

import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

/*Created on 19/01/19. */
class Neo4jDriverTest {
    @Test
    fun canQueryForGeorgianCourseFromNeo4j() {
        val neo4jDriver = Neo4jDriver("neo4j", "zuhlke", 7687)
        val records = neo4jDriver.query("MATCH (c:Course) RETURN c")

        val courseNames = records.map { r -> r[0]["name"].toString() }

        assertThat(courseNames, hasItem("\"Georgian\""))
    }
}