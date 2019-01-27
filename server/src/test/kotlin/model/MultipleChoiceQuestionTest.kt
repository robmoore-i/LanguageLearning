package model

import neo4j.neo4jNode
import neo4j.stringValue
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

class MultipleChoiceQuestionTest {
    @Test
    fun canInitialiseFromNeo4jNode() {
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
        assertThat(mcq.choices['a'], equalTo("a"))
        assertThat(mcq.choices['b'], equalTo("b"))
        assertThat(mcq.choices['c'], equalTo("c"))
        assertThat(mcq.choices['d'], equalTo("d"))
        assertThat(mcq.answer, equalTo('c'))
    }
}