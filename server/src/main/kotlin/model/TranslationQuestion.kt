package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.neo4j.driver.v1.types.Node

data class TranslationQuestion(val given: String, val answers: List<String>) : Question {
    constructor(given: String, answer: String) : this(given, listOf(answer))

    private val json = Jackson

    override fun jsonify(questionIndex: Int): JsonNode {
        val answerPair = answerPair()
        return json {
            obj(
                "type" to number(0),
                "index" to number(questionIndex),
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

    companion object {
        fun fromNeo4jNode(node: Node): TranslationQuestion {
            val given = node["given"].toString().unquoted()
            val answers: List<String> = when {
                node.containsKey("answer") -> listOf(node["answer"].toString().unquoted())
                node.containsKey("answers") -> node["answers"].asList().map { answer -> answer.toString().unquoted() }
                else -> throw UnanswerableQuestionException(
                    "Translation question node must have either an 'answer' or 'answers' property, got neither."
                )
            }
            return TranslationQuestion(given, answers)
        }
    }
}
