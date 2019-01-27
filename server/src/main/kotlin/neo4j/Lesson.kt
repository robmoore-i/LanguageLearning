package neo4j

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class Lesson(val courseName: String, val lessonName: String, val lessonIndex: Int, val questions: List<Question>) {
    val json = Jackson

    fun jsonify(): JsonNode {
        return json {
            obj(
                "courseName" to string(courseName),
                "name" to string(lessonName),
                "index" to number(lessonIndex),
                "questions" to array(questions.map(Question::jsonify))
            )
        }
    }
}
