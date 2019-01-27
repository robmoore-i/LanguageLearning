package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class TranslationQuestion(val given: String, val answers: List<String>) : Question {
    constructor(given: String, answer: String) : this(given, listOf(answer))

    val json = Jackson

    override fun jsonify(): JsonNode {
        val answerPair = answerPair()
        return json {
            obj(
                "given" to string(given),
                answerPair
            )
        }
    }

    private fun answerPair(): Pair<String, JsonNode> {
        return "answer" to json.string(answers[0])
    }
}