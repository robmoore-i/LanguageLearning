package json

import com.fasterxml.jackson.databind.JsonNode
import model.Lesson
import model.Question
import model.ReadingQuestion
import model.ReadingSubQuestion
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Test
import server.JsonEncoder

class ReadingQuestionEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun readingQuestionIsEncodedWithType2() {
        val questions = listOf<Question>(
            ReadingQuestion(listOf(ReadingSubQuestion("given", "answer")))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val readingQuestion = node["questions"][0]
        assertThat(readingQuestion["type"].asInt(), equalTo(2))
    }

    @Test
    fun rqIsEncodedWithIndex() {
        val questions = listOf<Question>(
            ReadingQuestion(listOf(ReadingSubQuestion("given", "answer")))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val rq = node["questions"][0]
        assertThat(rq["index"].asInt(), equalTo(0))
    }

    @Test
    fun canEncodeSingleAnswerSubquestions() {
        val questions = listOf<Question>(
            ReadingQuestion(listOf(ReadingSubQuestion("given", "answer")))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val rq = node["questions"][0]
        assertThat(rq["questions"].size(), equalTo(1))
        val rsq = rq["questions"][0]
        assertThat(rsq["given"].toString().unquoted(), equalTo("given"))
        assertThat(rsq["answer"].toString().unquoted(), equalTo("answer"))
    }
}