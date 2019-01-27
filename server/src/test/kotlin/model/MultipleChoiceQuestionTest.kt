package model

import neo4j.neo4jNode
import neo4j.stringValue
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Assert.assertFalse
import org.junit.Test

class MultipleChoiceQuestionTest {
    @Test
    fun canInitialiseFromNeo4jNodeWith4Choices() {
        val node = neo4jNode(
            listOf("Question", "MultipleChoiceQuestion"),
            mapOf(
                "question" to stringValue("is 'c'"),
                "a" to stringValue("a"),
                "b" to stringValue("b"),
                "c" to stringValue("c"),
                "d" to stringValue("d"),
                "answer" to stringValue("c")
            )
        )

        val mcq = MultipleChoiceQuestion.fromNeo4jNode(node)

        assertThat(mcq.question, equalTo("is 'c'"))
        assertThat(mcq.answer, equalTo('c'))
        assertThat(mcq.choices['a'], equalTo("a"))
        assertThat(mcq.choices['b'], equalTo("b"))
        assertThat(mcq.choices['c'], equalTo("c"))
        assertThat(mcq.choices['d'], equalTo("d"))
    }

    @Test
    fun canInitialiseFromNeo4jNodeWith3Choices() {
        val node = neo4jNode(
            listOf("Question", "MultipleChoiceQuestion"),
            mapOf(
                "question" to stringValue("is 'c'"),
                "a" to stringValue("a"),
                "b" to stringValue("b"),
                "c" to stringValue("c"),
                "answer" to stringValue("c")
            )
        )

        val mcq = MultipleChoiceQuestion.fromNeo4jNode(node)

        assertThat(mcq.question, equalTo("is 'c'"))
        assertThat(mcq.answer, equalTo('c'))
        assertThat(mcq.choices['a'], equalTo("a"))
        assertThat(mcq.choices['b'], equalTo("b"))
        assertThat(mcq.choices['c'], equalTo("c"))
        assertFalse(mcq.choices.containsKey('d'))
    }

    @Test
    fun canInitialiseFromNeo4jNodeWith5Choices() {
        val node = neo4jNode(
            listOf("Question", "MultipleChoiceQuestion"),
            mapOf(
                "question" to stringValue("is 'b'"),
                "a" to stringValue("a"),
                "b" to stringValue("b"),
                "c" to stringValue("c"),
                "d" to stringValue("d"),
                "e" to stringValue("e"),
                "answer" to stringValue("b")
            )
        )

        val mcq = MultipleChoiceQuestion.fromNeo4jNode(node)

        assertThat(mcq.question, equalTo("is 'b'"))
        assertThat(mcq.answer, equalTo('b'))
        assertThat(mcq.choices['a'], equalTo("a"))
        assertThat(mcq.choices['b'], equalTo("b"))
        assertThat(mcq.choices['c'], equalTo("c"))
        assertThat(mcq.choices['d'], equalTo("d"))
        assertThat(mcq.choices['e'], equalTo("e"))
    }
}