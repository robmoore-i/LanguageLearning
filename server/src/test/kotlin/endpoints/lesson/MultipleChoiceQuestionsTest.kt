package endpoints.lesson

import endpoints.EndpointTestCase
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.unquoted
import org.junit.Assert.assertFalse
import org.junit.Test

class MultipleChoiceQuestionsTest : EndpointTestCase() {

    @Test
    fun canGetMcqWith4Choices() {
        testDatabaseAdaptor.runQuery("""
                CREATE (hello:TopicLesson {name: "MCQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "Course", image: "img.png"})
                CREATE (hello)-[:HAS_QUESTION {index: 0}]->(letterA:Question:MultipleChoiceQuestion {question: "sounds like \"a\" in English", a: "მ",b:"ბ", c:"გ", d:"ა", answer: "d"})
                RETURN hello,letterA,c;
                """)

        val responseJson = lessonRequestJson("Course", "MCQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val mcq = questions[0]
        assertThat(mcq["type"].asInt(), equalTo(1))
        assertThat(mcq["index"].asInt(), equalTo(0))
        assertThat(mcq["question"].toString().unquoted(), equalTo("sounds like \"a\" in English"))
        assertThat(mcq["answer"].toString().unquoted(), equalTo("d"))
        assertThat(mcq["a"].toString().unquoted(), equalTo("მ"))
        assertThat(mcq["b"].toString().unquoted(), equalTo("ბ"))
        assertThat(mcq["c"].toString().unquoted(), equalTo("გ"))
        assertThat(mcq["d"].toString().unquoted(), equalTo("ა"))
    }

    @Test
    fun canGetMcqWith3Choices() {
        testDatabaseAdaptor.runQuery("""
                CREATE (hello:TopicLesson {name: "MCQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "Course", image: "img.png"})
                CREATE (hello)-[:HAS_QUESTION {index: 0}]->(letterA:Question:MultipleChoiceQuestion {question: "sounds like \"a\" in English", a: "მ",b:"ბ", c:"ა", answer: "c"})
                RETURN hello,letterA,c;
                """)

        val responseJson = lessonRequestJson("Course", "MCQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val mcq = questions[0]
        assertThat(mcq["type"].asInt(), equalTo(1))
        assertThat(mcq["index"].asInt(), equalTo(0))
        assertThat(mcq["question"].toString().unquoted(), equalTo("sounds like \"a\" in English"))
        assertThat(mcq["answer"].toString().unquoted(), equalTo("c"))
        assertThat(mcq["a"].toString().unquoted(), equalTo("მ"))
        assertThat(mcq["b"].toString().unquoted(), equalTo("ბ"))
        assertThat(mcq["c"].toString().unquoted(), equalTo("ა"))
        assertFalse(mcq.has("d"))
    }
}