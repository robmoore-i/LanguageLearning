package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class ReadingQuestion(val subquestions: List<ReadingSubQuestion>) : Question {
    private val json = Jackson

    override fun jsonify(questionIndex: Int): JsonNode {
        return json {
            obj(
                "type" to number(2),
                "index" to number(questionIndex),
                "questions" to array(subquestions.map(ReadingSubQuestion::jsonify))
            )
        }
    }
}