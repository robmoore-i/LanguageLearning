package model

import com.fasterxml.jackson.databind.JsonNode

interface JsonEncodable {
    fun jsonify(): JsonNode

}
