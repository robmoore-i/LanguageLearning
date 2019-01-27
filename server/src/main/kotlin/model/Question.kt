package model

import com.fasterxml.jackson.databind.JsonNode

interface Question {
    fun jsonify(): JsonNode
}
