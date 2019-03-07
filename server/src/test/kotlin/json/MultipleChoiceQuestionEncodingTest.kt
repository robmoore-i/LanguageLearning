package json

import com.fasterxml.jackson.databind.JsonNode
import model.Lesson
import model.MultipleChoiceQuestion
import model.Question
import model.UnanswerableQuestionException
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
            MultipleChoiceQuestion("sounds like 'i' in English", mapOf('a' to "a"), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["type"].asInt(), CoreMatchers.equalTo(1))
    }

    @Test
    fun mcqIsEncodedWithIndex() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("sounds like 'i' in English", mapOf('a' to "a"), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["index"].asInt(), CoreMatchers.equalTo(0))
    }

    @Test
    fun mcqIsEncodedWithQuestion() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("sounds like 'i' in English", mapOf('a' to "a"), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["question"].toString().unquoted(), CoreMatchers.equalTo("sounds like 'i' in English"))
    }

    @Test
    fun encodesAllChoicesIn4ChoiceMCQ() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c", 'd' to "d"), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

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
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c"), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["a"].toString().unquoted(), CoreMatchers.equalTo("a"))
        assertThat(mcq["b"].toString().unquoted(), CoreMatchers.equalTo("b"))
        assertThat(mcq["c"].toString().unquoted(), CoreMatchers.equalTo("c"))
        assertFalse(mcq.has("d"))
    }

    @Test
    fun encodedWithAnswer() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c"), 'c')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["answer"].toString().unquoted(), CoreMatchers.equalTo("c"))
    }

    @Test
    fun encodesAllChoicesIn5ChoiceMCQ() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("is 'a'", mapOf('a' to "a", 'b' to "b", 'c' to "c", 'd' to "d", 'e' to "e"), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded)
        val mcq = node["questions"][0]
        assertThat(mcq["a"].toString().unquoted(), CoreMatchers.equalTo("a"))
        assertThat(mcq["b"].toString().unquoted(), CoreMatchers.equalTo("b"))
        assertThat(mcq["c"].toString().unquoted(), CoreMatchers.equalTo("c"))
        assertThat(mcq["d"].toString().unquoted(), CoreMatchers.equalTo("d"))
        assertThat(mcq["e"].toString().unquoted(), CoreMatchers.equalTo("e"))
        assertFalse(mcq.has("f"))
    }

    @Test(expected = UnanswerableQuestionException::class)
    fun throwsUnanswerableQuestionExceptionIfThereAreNoChoices() {
        val questions = listOf<Question>(
            MultipleChoiceQuestion("is 'a'", mapOf(), 'a')
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encode(lesson)

        val node: JsonNode = json.parse(encoded) // Should throw here
        println(node)
    }
}