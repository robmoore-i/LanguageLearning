package unit

import com.fasterxml.jackson.databind.JsonNode
import neo4j.Lesson
import neo4j.Question
import neo4j.TranslationQuestion
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Test
import server.JsonEncoder

class JsonEncoderTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun canEncodeEmptyLesson() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)

        assertThat(node["courseName"].toString().unquoted(), equalTo("Georgian"))
        assertThat(node["name"].toString().unquoted(), equalTo("lesson-name"))
        assertThat(node["index"].asInt(), equalTo(0))
        assertThat(node["questions"].size(), equalTo(0))
    }

    @Test
    fun canEncodeLessonWithSingleAnswerTranslationQuestion() {
        val questions = listOf<Question>(
            TranslationQuestion("given", "answer")
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)

        assertThat(node["courseName"].toString().unquoted(), equalTo("Georgian"))
        assertThat(node["name"].toString().unquoted(), equalTo("lesson-name"))
        assertThat(node["index"].asInt(), equalTo(0))
        assertThat(node["questions"].size(), equalTo(1))
        assertThat(node["questions"][0]["given"].toString().unquoted(), equalTo("given"))
        assertThat(node["questions"][0]["answer"].toString().unquoted(), equalTo("answer"))
    }
}