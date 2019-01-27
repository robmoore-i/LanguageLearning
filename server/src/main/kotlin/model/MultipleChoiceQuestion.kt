package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class MultipleChoiceQuestion(val question: String, val choices: Map<Char, String>) : Question {
    val json = Jackson

    override fun jsonify(): JsonNode {
        return json {
            obj(
                listOf(
                    "type" to number(1),
                    "question" to string(question)
                )
            )
        }
    }
}