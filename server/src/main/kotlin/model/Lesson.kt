package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson

data class Lesson(val courseName: String, val lessonName: String, val lessonIndex: Int, val questions: List<Question>) {
    val json = Jackson

    fun jsonify(): JsonNode {
        val jsonQuestions = questions.mapIndexed { i, question -> question.jsonify(i) }
        return json {
            obj(
                "courseName" to string(courseName),
                "name" to string(lessonName),
                "index" to number(lessonIndex),
                "questions" to array(jsonQuestions)
            )
        }
    }
}
