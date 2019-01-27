package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.neo4j.driver.v1.types.Node

data class MultipleChoiceQuestion(val question: String, val choices: Map<Char, String>, val answer: Char) : Question {
    val json = Jackson

    override fun jsonify(questionIndex: Int): JsonNode {
        return json { obj(fields(questionIndex)) }
    }

    private fun fields(questionIndex: Int): MutableList<Pair<String, JsonNode>> {
        if (choices.isEmpty()) {
            throw UnanswerableQuestionException("Multiple choice question must have at least one choice, got none. The question was: \"Which one of these $question?\"")
        }

        val fields: MutableList<Pair<String, JsonNode>> = mutableListOf()
        for (choice in choices) {
            fields.add(choice.key.toString() to json.string(choice.value))
        }
        fields.add("type" to json.number(1))
        fields.add("index" to json.number(questionIndex))
        fields.add("question" to json.string(question))
        fields.add("answer" to json.string(answer.toString()))
        return fields
    }

    companion object {
        fun fromNeo4jNode(node: Node): MultipleChoiceQuestion {
            val question = node["question"].toString().unquoted()

            val choices: MutableMap<Char, String> = mutableMapOf()
            val alphabet = "abcdef"
            var i = 0
            var currentLetter = alphabet[i]
            while (node.containsKey(currentLetter.toString())) {
                choices[currentLetter] = node[currentLetter.toString()].toString().unquoted()
                i += 1
                currentLetter = alphabet[i]
            }

            val answer = node["answer"].toString().unquoted().first()

            return MultipleChoiceQuestion(question, choices, answer)
        }
    }
}