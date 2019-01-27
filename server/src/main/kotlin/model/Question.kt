package model

import com.fasterxml.jackson.databind.JsonNode

interface Question {
    fun jsonify(questionIndex: Int): JsonNode
}

class UnanswerableQuestionException(message: String) : Throwable(message)