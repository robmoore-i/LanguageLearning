package model

import com.fasterxml.jackson.databind.JsonNode

interface Question {
    fun jsonify(): JsonNode
}

class UnanswerableQuestionException(message: String) : Throwable(message)