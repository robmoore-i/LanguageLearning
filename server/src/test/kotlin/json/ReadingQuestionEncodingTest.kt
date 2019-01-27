package json

import com.fasterxml.jackson.databind.JsonNode
import model.Lesson
import model.Question
import model.ReadingQuestion
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.junit.Test
import server.JsonEncoder

class ReadingQuestionEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun readingQuestionIsEncodedWithType2() {
        val questions = listOf<Question>(
            ReadingQuestion()
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val readingQuestion = node["questions"][0]
        assertThat(readingQuestion["type"].asInt(), CoreMatchers.equalTo(2))
    }

    @Test
    fun rqIsEncodedWithIndex() {
        val questions = listOf<Question>(
            ReadingQuestion()
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val tq = node["questions"][0]
        assertThat(tq["index"].asInt(), CoreMatchers.equalTo(0))
    }
}