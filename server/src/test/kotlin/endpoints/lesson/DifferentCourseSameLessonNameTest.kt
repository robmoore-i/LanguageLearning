package endpoints.lesson

import endpoints.EndpointTestCase
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.unquoted
import org.junit.Test

class DifferentCourseSameLessonNameTest : EndpointTestCase() {
    @Test
    fun canGetALessonSharingTheNameWithALessonFromADiferentCourse() {
        testDatabaseAdaptor.runQuery("""
                CREATE (ge:Course {name: "Georgian", image: "img.png"})
                CREATE (fr:Course {name: "French", image: "img.png"})

                CREATE (ge)-[:HAS_TOPIC_LESSON {index: 0}]->(gehello:TopicLesson {name: "Hello!"})
                CREATE (fr)-[:HAS_TOPIC_LESSON {index: 0}]->(frhello:TopicLesson {name: "Hello!"})

                CREATE (frhello)-[:HAS_QUESTION {index: 0}]->(frtq:Question:TranslationQuestion {given: "Hi", answer: "Bonjour"})
                CREATE (gehello)-[:HAS_QUESTION {index: 0}]->(getq:Question:TranslationQuestion {given: "Hello", answer: "გამარჯობა"})

                RETURN ge,fr,gehello,frhello,frtq,getq;
                """)

        val frenchQuestion = lessonRequestJson("French", "Hello!")["questions"][0]
        assertThat(frenchQuestion["given"].toString().unquoted(), CoreMatchers.equalTo("Hi"))
        assertThat(frenchQuestion["answer"].toString().unquoted(), CoreMatchers.equalTo("Bonjour"))

        val georgianQuestion = lessonRequestJson("Georgian", "Hello!")["questions"][0]
        assertThat(georgianQuestion["given"].toString().unquoted(), CoreMatchers.equalTo("Hello"))
        assertThat(georgianQuestion["answer"].toString().unquoted(), CoreMatchers.equalTo("გამარჯობა"))
    }
}