package model

import com.fasterxml.jackson.databind.JsonNode
import neo4j.Neo4jDatabaseAdaptor
import org.http4k.format.Jackson
import org.neo4j.driver.v1.Value

data class Lesson(val courseName: String, val lessonName: String, val lessonIndex: Int, val questions: List<Question>) {
    val json = Jackson

    fun jsonify(): JsonNode {
        val jsonQuestions = questions.mapIndexed { i, question -> question.jsonify(i) }
        return json {
            obj(
                "courseName" to string(courseName),
                "name" to string(lessonName),
                "index" to number(lessonIndex),
                "questions" to array(jsonQuestions)
            )
        }
    }

    companion object {
        fun fromNeo4jValuePairs(
            courseName: String,
            lessonName: String,
            lessonIndex: Int,
            valuePairs: List<Pair<Value, Value>>,
            neo4jDatabaseAdaptor: Neo4jDatabaseAdaptor
        ): Lesson {
            val questions: MutableList<Question> = mutableListOf()

            valuePairs.forEach { (nodeValue, indexValue) ->
                val node = nodeValue.asNode()
                val index = indexValue.asInt()
                val question = when {
                    node.hasLabel("TranslationQuestion") -> TranslationQuestion.fromNeo4jNode(node)
                    node.hasLabel("MultipleChoiceQuestion") -> MultipleChoiceQuestion.fromNeo4jNode(node)
                    node.hasLabel("ReadingQuestion") -> ReadingQuestion.fromNeo4jNode(
                        node,
                        neo4jDatabaseAdaptor,
                        courseName,
                        lessonName,
                        lessonIndex
                    )
                    else -> throw UnsupportedQuestionType(node.labels())
                }
                questions.add(index, question)
            }

            return Lesson(courseName, lessonName, lessonIndex, questions)
        }
    }
}

class UnsupportedQuestionType(nodeLabels: Iterable<String>) :
    Throwable("Expected a question-type label, got: ${nodeLabels.toList()}")
