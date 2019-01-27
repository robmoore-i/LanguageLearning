package json

import com.fasterxml.jackson.databind.JsonNode
import model.*
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Test
import server.JsonEncoder

class LessonJsonEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun canEncodeLessonWithThreeTypesOfQuestion() {
        val questions = listOf(
            TranslationQuestion("tq-given", listOf("tq-answer-1", "tq-answer-2")),
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c", 'd' to "d"), 'a'),
            ReadingQuestion("rq-extract", listOf(ReadingSubQuestion("rsq-given", "rsq-answer")))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)

        assertThat(node["questions"].size(), equalTo(3))

        val tq = node["questions"][0]
        assertThat(tq["type"].asInt(), equalTo(0))
        assertThat(tq["index"].asInt(), equalTo(0))
        assertThat(tq["given"].toString().unquoted(), equalTo("tq-given"))
        assertThat(tq["answers"][0].toString().unquoted(), equalTo("tq-answer-1"))
        assertThat(tq["answers"][1].toString().unquoted(), equalTo("tq-answer-2"))

        val mcq = node["questions"][1]
        assertThat(mcq["type"].asInt(), equalTo(1))
        assertThat(mcq["index"].asInt(), equalTo(1))
        assertThat(mcq["question"].toString().unquoted(), equalTo("is 'a'"))
        assertThat(mcq["a"].toString().unquoted(), equalTo("a"))
        assertThat(mcq["b"].toString().unquoted(), equalTo("b"))
        assertThat(mcq["c"].toString().unquoted(), equalTo("c"))
        assertThat(mcq["d"].toString().unquoted(), equalTo("d"))
        assertThat(mcq["answer"].toString().unquoted(), equalTo("a"))

        val rq = node["questions"][2]
        assertThat(rq["type"].asInt(), equalTo(2))
        assertThat(rq["index"].asInt(), equalTo(2))
        assertThat(rq["extract"].toString().unquoted(), equalTo("rq-extract"))

        val rsq = rq["questions"][0]
        assertThat(rsq["given"].toString().unquoted(), equalTo("rsq-given"))
        assertThat(rsq["answer"].toString().unquoted(), equalTo("rsq-answer"))
    }

    @Test
    fun canEncodeLessonWithNoQuestions() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        assertThat(node["questions"].size(), equalTo(0))
    }

    @Test
    fun canEncodeLessonWithCourseName() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        assertThat(node["courseName"].toString().unquoted(), equalTo("Georgian"))
    }

    @Test
    fun canEncodeLessonWithLessonName() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        assertThat(node["name"].toString().unquoted(), equalTo("lesson-name"))
    }

    @Test
    fun canEncodeLessonWithIndex() {
        val questions = listOf<Question>()
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        assertThat(node["index"].asInt(), equalTo(0))
    }
}