package json

import com.fasterxml.jackson.databind.JsonNode
import model.AnswerlessQuestionException
import model.Lesson
import model.Question
import model.TranslationQuestion
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Assert.assertFalse
import org.junit.Test
import server.JsonEncoder

class TranslationQuestionEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun translationQuestionIsEncodedWithType0() {
        val questions = listOf<Question>(
            TranslationQuestion("given", "answer")
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        val translationQuestion = node["questions"][0]
        assertThat(translationQuestion["type"].asInt(), equalTo(0))
    }

    @Test(expected = AnswerlessQuestionException::class)
    fun throwsAnswerlessQuestionExceptionIfTryingToEncodeTranslationQuestionWithoutAnswers() {
        val questions = listOf<Question>(
            TranslationQuestion("given", listOf())
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node = json.parse(encoded) // Should throw here
        println(node)
    }

    @Test
    fun canEncodeLessonWithMultipleAnswerTranslationQuestion() {
        val questions = listOf<Question>(
            TranslationQuestion("given", listOf("answer-1", "answer-2", "answer-3", "answer-4"))
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        assertThat(node["questions"].size(), equalTo(1))
        val translationQuestion = node["questions"][0]
        assertThat(translationQuestion["given"].toString().unquoted(), equalTo("given"))
        assertThat(
            translationQuestion["answers"].map { answer -> answer.toString().unquoted() }.toList(),
            equalTo(listOf("answer-1", "answer-2", "answer-3", "answer-4"))
        )
        assertFalse(translationQuestion.has("answer"))
    }

    @Test
    fun canEncodeLessonWithSingleAnswerTranslationQuestion() {
        val questions = listOf<Question>(
            TranslationQuestion("given", "answer")
        )
        val lesson = Lesson("Georgian", "lesson-name", 0, questions)

        val encoded = encoder.encodeLesson(lesson)

        val node: JsonNode = json.parse(encoded)
        assertThat(node["questions"].size(), equalTo(1))
        val translationQuestion = node["questions"][0]
        assertThat(translationQuestion["given"].toString().unquoted(), equalTo("given"))
        assertThat(translationQuestion["answer"].toString().unquoted(), equalTo("answer"))
    }
}