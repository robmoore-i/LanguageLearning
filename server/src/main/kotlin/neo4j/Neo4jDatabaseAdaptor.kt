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

    fun lessonIndex(lessonName: String): Int {
        val queryValuesWithParams = neo4jDriver.queryValuesWithParams(
            "MATCH (tl:TopicLesson {name: {lessonName}})<-[r:HAS_TOPIC_LESSON]-(c:Course) RETURN r.index",
            mapOf("lessonName" to lessonName)
        )
        return queryValuesWithParams[0].asInt()
    }

    // questions: MATCH (tl:TopicLesson {name: {name}})-[r:HAS_QUESTION]->(q) RETURN q,r.index
}

//fun main(args: Array<String>) {
//    val neo4jDriver = Neo4jDriver("neo4j", "zuhlke", 7687)
//    val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
//        neo4jDriver,
//        "/home/rob/Documents/language/language-learning/database/images/",
//        "/home/rob/Documents/language/language-learning/database/extracts/"
//    )
//    val lessonIndex = neo4jDatabaseAdaptor.lessonIndex("Peace Corps Georgia: Hello")
//
//    println(lessonIndex)
//}

