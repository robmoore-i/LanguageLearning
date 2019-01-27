package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.neo4j.driver.v1.types.Node

data class ReadingQuestion(val extract: String, val subquestions: List<ReadingSubQuestion>) : Question {
    private val json = Jackson

    override fun jsonify(questionIndex: Int): JsonNode {
        val subquestions = subquestions.mapIndexed { i, subquestion -> subquestion.jsonify(i) }
        return json {
            obj(
                "type" to number(2),
                "index" to number(questionIndex),
                "extract" to string(extract),
                "questions" to array(subquestions)
            )
        }
    }

    companion object {
        fun fromNeo4jNode(node: Node, index: Int): ReadingQuestion {
            return ReadingQuestion("", listOf())
        }
    }
}