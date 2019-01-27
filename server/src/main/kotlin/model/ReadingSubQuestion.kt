package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class ReadingSubQuestion(val given: String, val answers: List<String>) {
    constructor(given: String, answer: String) : this(given, listOf(answer))

    private val json = Jackson

    fun jsonify(subquestionIndex: Int): JsonNode {
        val answerPair = answerPair()
        return json {
            obj(
                "index" to number(subquestionIndex),
                "given" to string(given),
                answerPair
            )
        }
    }

    private fun answerPair(): Pair<String, JsonNode> {
        return when {
            answers.size > 1 -> "answers" to json { array(answers.map(this::string)) }
            answers.size == 1 -> "answer" to json.string(answers[0])
            else -> throw UnanswerableQuestionException("Translation question must have at least one answer, got: $answers")
        }
    }
}
