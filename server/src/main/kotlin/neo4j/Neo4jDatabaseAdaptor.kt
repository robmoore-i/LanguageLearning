package neo4j

import model.Course
import model.CourseMetadata
import model.Lesson
import model.ReadingSubQuestion
import server.DatabaseAdaptor
import java.io.File
import java.nio.file.Paths

open class Neo4jDatabaseAdaptor(
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

    private fun lessonIndex(courseName: String, lessonName: String): Int {
        val queryValuesWithParams = neo4jDriver.queryValuesWithParams(
            "MATCH (tl:TopicLesson {name: {lessonName}})<-[r:HAS_TOPIC_LESSON]-(c:Course) RETURN r.index",
            mapOf("lessonName" to lessonName)
        )
        return queryValuesWithParams[0].asInt()
    }

    override fun lesson(courseName: String, lessonName: String): Lesson {
        val valuePairs = neo4jDriver.queryTwoValuesWithParams(
            "MATCH (tl:TopicLesson {name: {lessonName}})-[r:HAS_QUESTION]->(q) RETURN q,r.index",
            mapOf("lessonName" to lessonName)
        )
        val lessonIndex = lessonIndex(courseName, lessonName)
        return Lesson.fromNeo4jValuePairs(courseName, lessonName, lessonIndex, valuePairs, this)
    }

    open fun readingSubQuestions(courseName: String, lessonName: String, lessonIndex: Int): List<ReadingSubQuestion> {
        val valuePairs = neo4jDriver.queryTwoValuesWithParams(
            "MATCH (tl:TopicLesson {name: {lessonName}})-[:HAS_QUESTION {index: {lessonIndex}}]->(rq:ReadingQuestion)-[r:HAS_SUBQUESTION]->(rsq:ReadingSubQuestion) RETURN rsq,r.index",
            mapOf(
                "lessonName" to lessonName,
                "lessonIndex" to lessonIndex.toString()
            )
        )

        val subquestionsIndexMapped: MutableMap<Int, ReadingSubQuestion> = mutableMapOf()

        valuePairs.forEach { (nodeValue, indexValue) ->
            val index = indexValue.asInt()
            val node = nodeValue.asNode()
            val rsq = ReadingSubQuestion.fromNeo4jNode(node)
            subquestionsIndexMapped[index] = rsq
        }

        @Suppress("UnnecessaryVariable") val subquestions =
            subquestionsIndexMapped.toSortedMap().map { entry -> entry.value }

        return subquestions
    }

    open fun readExtract(extractRelativePath: String): String {
        return File(Paths.get(extractsPath, extractRelativePath).toUri()).readText()
    }
}

