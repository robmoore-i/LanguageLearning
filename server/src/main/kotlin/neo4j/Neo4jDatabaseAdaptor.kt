package neo4j

import model.Course
import model.CourseMetadata
import server.DatabaseAdaptor

class Neo4jDatabaseAdaptor(
    private val neo4jDriver: Neo4jDriver,
    private val imagesPath: String,
    private val extractsPath: String
) : DatabaseAdaptor {

    override fun allCourses(): List<Course> {
        val values = neo4jDriver.queryValues("MATCH (c:Course) RETURN c")
        return values.map { value -> Course.fromNeo4jValue(value, imagesPath) }
    }

    override fun courseMetadata(courseName: String): CourseMetadata {
        val valuePairs = neo4jDriver.queryTwoValuesWithParams(
            "MATCH (c:Course {name: {courseName}})-[r:HAS_TOPIC_LESSON]->(l) RETURN l.name,r.index",
            mapOf("courseName" to courseName)
        )

        return CourseMetadata.fromNeo4jValuePairs(valuePairs)
    }
}

