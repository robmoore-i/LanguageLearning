package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class MultipleChoiceQuestion(val question: String, val choices: Map<Char, String>, val answer: Char) : Question {
    val json = Jackson

    override fun jsonify(): JsonNode {
        return json { obj(fields()) }
    }

    private fun fields(): MutableList<Pair<String, JsonNode>> {
        if (choices.isEmpty()) {
            throw UnanswerableQuestionException("Multiple choice question must have at least one choice, got none. The question was: \"Which one of these $question?\"")
        }

        val fields: MutableList<Pair<String, JsonNode>> = mutableListOf()
        for (choice in choices) {
            fields.add(choice.key.toString() to json.string(choice.value))
        }
        fields.add("type" to json.number(1))
        fields.add("question" to json.string(question))
        fields.add("answer" to json.string(answer.toString()))
        return fields
    }
}