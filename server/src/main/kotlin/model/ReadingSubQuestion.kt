package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class ReadingSubQuestion(val given: String, val answer: String) {
    private val json = Jackson

    fun jsonify(subquestionIndex: Int): JsonNode {
        return json {
            obj(
                "given" to string(given),
                "answer" to string(answer),
                "index" to number(subquestionIndex)
            )
        }
    }

}
