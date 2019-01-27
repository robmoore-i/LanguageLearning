package model

import com.fasterxml.jackson.databind.JsonNode

interface Question {
    fun jsonify(): JsonNode
}

class AnswerlessQuestionException(message: String) : Throwable(message)