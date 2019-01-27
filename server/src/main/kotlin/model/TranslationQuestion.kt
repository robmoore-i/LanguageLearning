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
                "type" to number(0),
                "given" to string(given),
                answerPair
            )
        }
    }

    private fun answerPair(): Pair<String, JsonNode> {
        return when {
            answers.size > 1 -> "answers" to json { array(answers.map(this::string)) }
            answers.size == 1 -> "answer" to json.string(answers[0])
            else -> throw AnswerlessQuestionException("Translation question must have at least one answer, got: $answers")
        }
    }
}
