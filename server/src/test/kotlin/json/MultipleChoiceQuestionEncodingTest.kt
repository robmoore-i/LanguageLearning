package json

import com.fasterxml.jackson.databind.JsonNode
import model.Lesson
import model.MultipleChoiceQuestion
import model.Question
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Assert.assertFalse
import org.junit.Test
import server.JsonEncoder

class MultipleChoiceQuestionEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun mcqIsEncodedWithType1() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("sounds like 'i' in English", mapOf('a' to "a"))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["type"].asInt(), CoreMatchers.equalTo(1))
    }

    @Test
    fun mcqIsEncodedWithQuestion() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("sounds like 'i' in English", mapOf('a' to "a"))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["question"].toString().unquoted(), CoreMatchers.equalTo("sounds like 'i' in English"))
    }

    @Test
    fun encodesAllChoicesIn4ChoiceMCQ() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c", 'd' to "d"))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["a"].toString().unquoted(), CoreMatchers.equalTo("a"))
        assertThat(mcq["b"].toString().unquoted(), CoreMatchers.equalTo("b"))
        assertThat(mcq["c"].toString().unquoted(), CoreMatchers.equalTo("c"))
        assertThat(mcq["d"].toString().unquoted(), CoreMatchers.equalTo("d"))
    }

    @Test
    fun encodesAllChoicesIn3ChoiceMCQ() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c"))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["a"].toString().unquoted(), CoreMatchers.equalTo("a"))
        assertThat(mcq["b"].toString().unquoted(), CoreMatchers.equalTo("b"))
        assertThat(mcq["c"].toString().unquoted(), CoreMatchers.equalTo("c"))
        assertFalse(mcq.has("d"))
    }
}