package neo4j

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class TranslationQuestion(val given: String, val answer: String) : Question {
    val json = Jackson

    override fun jsonify(): JsonNode {
        return json {
            obj(
                "given" to string(given),
                "answer" to string(answer)
            )
        }
    }
}