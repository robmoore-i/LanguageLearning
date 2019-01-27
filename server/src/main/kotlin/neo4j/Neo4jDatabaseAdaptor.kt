package neo4j

import model.Course
import model.CourseMetadata
import model.Lesson
import org.neo4j.driver.v1.Record
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

    fun lessonIndex(lessonName: String): Int {
        val queryValuesWithParams = neo4jDriver.queryValuesWithParams(
            "MATCH (tl:TopicLesson {name: {lessonName}})<-[r:HAS_TOPIC_LESSON]-(c:Course) RETURN r.index",
            mapOf("lessonName" to lessonName)
        )
        return queryValuesWithParams[0].asInt()
    }

    fun lesson(courseName: String, lessonName: String): Lesson {
        val valuePairs = neo4jDriver.queryTwoValuesWithParams(
            "MATCH (tl:TopicLesson {name: {lessonName}})-[r:HAS_QUESTION]->(q) RETURN q,r.index",
            mapOf("lessonName" to lessonName)
        )

        val lessonIndex = lessonIndex(lessonName)

        return Lesson.fromNeo4jValuePairs(courseName, lessonName, lessonIndex, valuePairs)
    }

    // questions: MATCH (tl:TopicLesson {name: {name}})-[r:HAS_QUESTION]->(q) RETURN q,r.index
}

fun main(args: Array<String>) {
    val neo4jDriver = Neo4jDriver("neo4j", "zuhlke", 7687)
    val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
        neo4jDriver,
        "/home/rob/Documents/language/language-learning/database/images/",
        "/home/rob/Documents/language/language-learning/database/extracts/"
    )

    val query = "MATCH (tl:TopicLesson {name: {lessonName}})-[r:HAS_QUESTION]->(q) RETURN q,r.index"
    val params = mapOf("lessonName" to "Peace Corps Georgia: Hello")
    val valuePairs = neo4jDriver.driver.session().readTransaction { tx -> tx.run(query, params).list() }
        .map { record: Record -> Pair(record.valueInColumn(0), record.valueInColumn(1)) }

    println(valuePairs[0].first.asNode().labels())
}

