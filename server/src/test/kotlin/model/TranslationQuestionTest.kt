package model

import neo4j.listValue2
import neo4j.neo4jNode
import neo4j.stringValue
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

class TranslationQuestionTest {
    @Test
    fun canInitialiseFromNeo4jNodeWithSingleAnswer() {
        val node = neo4jNode(
            listOf("Question", "TranslationQuestion"),
            mapOf(
                "given" to stringValue("given"),
                "answer" to stringValue("answer")
            )
        )

        val translationQuestion = TranslationQuestion.fromNeo4jNode(node)

        assertThat(translationQuestion.answers.size, equalTo(1))
        assertThat(translationQuestion.answers[0], equalTo("answer"))
        assertThat(translationQuestion.given, equalTo("given"))
    }

    @Test
    fun canInitialiseFromNeo4jNodeWithMultipleAnswers() {
        val node = neo4jNode(
            listOf("Question", "TranslationQuestion"),
            mapOf(
                "given" to stringValue("given"),
                "answers" to listValue2(stringValue("answer-1"), stringValue("answer-2"))
            )
        )

        val translationQuestion = TranslationQuestion.fromNeo4jNode(node)

        assertThat(translationQuestion.answers.size, equalTo(2))
        assertThat(translationQuestion.answers[0], equalTo("answer-1"))
        assertThat(translationQuestion.answers[1], equalTo("answer-2"))
        assertThat(translationQuestion.given, equalTo("given"))
    }
}