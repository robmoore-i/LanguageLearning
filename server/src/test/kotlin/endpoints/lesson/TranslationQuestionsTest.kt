package endpoints.lesson

import endpoints.EndpointTestCase
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.unquoted
import org.junit.Assert.assertFalse
import org.junit.Test

class TranslationQuestionsTest : EndpointTestCase() {
    @Test
    fun canGetTq() {
        testDatabaseAdaptor.runQuery("""
                CREATE (l:TopicLesson {name: "TQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "Georgian", image: "img.png"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})
                RETURN l,tq,c;
                """)

        val responseJson = lessonRequestJson("Georgian", "TQ")
        val questions = responseJson["questions"]
        assertThat(questions.size(), equalTo(1))

        val tq = questions[0]
        assertThat(tq["type"].asInt(), equalTo(0))
        assertThat(tq["index"].asInt(), equalTo(0))
        assertThat(tq["given"].toString().unquoted(), equalTo("What are you called?"))
        assertThat(tq["answer"].toString().unquoted(), equalTo("შენ რა გქვია?"))
    }

    @Test
    fun canGetTqWithMultipleAnswers() {
        testDatabaseAdaptor.runQuery("""
                CREATE (l:TopicLesson {name: "TQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "Georgian", image: "img.png"})
                CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "Blue", answers: ["ლურჯი", "ცისფერი"]})
                RETURN l,tq,c;
                """)

        val responseJson = lessonRequestJson("Georgian", "TQ")
        val questions = responseJson["questions"]

        val tq = questions[0]
        val answers = tq["answers"].map { answer -> answer.toString().unquoted() }
        assertThat(answers, hasItem("ლურჯი"))
        assertThat(answers, hasItem("ცისფერი"))
        assertFalse(tq.has("answer"))
    }
}