package model

import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import neo4j.Neo4jDatabaseAdaptor
import neo4j.neo4jNode
import neo4j.stringValue
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

class ReadingQuestionTest {
    @Test
    fun canExtractAnInlineExtractFromNeo4jNode() {
        val node = neo4jNode(
            listOf("Question", "ReadingQuestion"),
            mapOf("extractInline" to stringValue("inline-extract"))
        )

        val mockNeo4jAdaptor = mock<Neo4jDatabaseAdaptor> {
            on { readingSubQuestions("course", "lesson", 0) } doReturn listOf()
        }

        val rq = ReadingQuestion.fromNeo4jNode(node, mockNeo4jAdaptor, "course", "lesson", 0)

        assertThat(rq.extract, equalTo("inline-extract"))
    }

    @Test
    fun canExtractSubQuestionsFromNeo4jNode() {
        val node = neo4jNode(
            listOf("Question", "ReadingQuestion"),
            mapOf("extractInline" to stringValue("inline-extract"))
        )

        val subQuestions: List<ReadingSubQuestion> = listOf(
            ReadingSubQuestion("given-1", "answer-1"),
            ReadingSubQuestion("given-2", listOf("answer-2a", "answer-2b"))
        )

        val mockNeo4jAdaptor = mock<Neo4jDatabaseAdaptor> {
            on { readingSubQuestions("course", "lesson", 0) } doReturn subQuestions
        }

        val rq = ReadingQuestion.fromNeo4jNode(node, mockNeo4jAdaptor, "course", "lesson", 0)

        assertThat(rq.subquestions[0], equalTo(subQuestions[0]))
        assertThat(rq.subquestions[1], equalTo(subQuestions[1]))
    }
}