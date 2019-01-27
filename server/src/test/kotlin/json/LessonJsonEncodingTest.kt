package json

import com.fasterxml.jackson.databind.JsonNode
import model.Lesson
import model.Question
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Test
import server.JsonEncoder

class LessonJsonEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun canEncodeLessonWithNoQuestions() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        MatcherAssert.assertThat(node["questions"].size(), CoreMatchers.equalTo(0))
    }

    @Test
    fun canEncodeLessonWithCourseName() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        MatcherAssert.assertThat(node["courseName"].toString().unquoted(), CoreMatchers.equalTo("Georgian"))
    }

    @Test
    fun canEncodeLessonWithLessonName() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        MatcherAssert.assertThat(node["name"].toString().unquoted(), CoreMatchers.equalTo("lesson-name"))
    }

    @Test
    fun canEncodeLessonWithIndex() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        MatcherAssert.assertThat(node["index"].asInt(), CoreMatchers.equalTo(0))
    }
}