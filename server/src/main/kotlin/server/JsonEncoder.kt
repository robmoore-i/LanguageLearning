package server

import com.fasterxml.jackson.databind.JsonNode
import model.JsonEncodable

class JsonEncoder {
    fun encode(jsonEncodable: JsonEncodable) : String {
        return jsonEncodable.jsonify().toString()
    }

    fun encode(encodables: List<JsonEncodable>): String {
        return encodeArray(encodables.map { encodable-> encodable.jsonify() })
    }

    private fun encodeArray(nodes: List<JsonNode>): String {
        val stringBuilder = StringBuilder().append("[")
        for (node in nodes) {
            val stringCourse = node.toString()
            stringBuilder.append(stringCourse).append(",")
        }
        return stringBuilder.toString().dropLast(1) + "]"
    }
}
