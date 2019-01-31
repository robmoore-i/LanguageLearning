package endpoints.lesson

import endpoints.EndpointTestCase
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.unquoted
import org.junit.Test

class ErrorHandling : EndpointTestCase() {
    @Test
    fun reportsWhenCantFindTheSpecifiedLesson() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "Course", image: "img.png"})-[:HAS_TOPIC_LESSON {index: 0}]->(l:TopicLesson {name: "Lesson"})
                RETURN c,l;
                """

            session.run(query)
            session.close()
        }

        val response = lessonRequest("Course", "NonExistantLesson")

        assertThat(response.status.code, equalTo(404))
        assertThat(json.parse(response.bodyString())["cause"].toString().unquoted(), equalTo("NoSuchLesson"))
    }
}