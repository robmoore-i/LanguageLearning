package endpoints.lesson

import endpoints.IntegrationEndpointTestCase
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.unquoted
import org.junit.Test

class ErrorHandling : IntegrationEndpointTestCase() {
    @Test
    fun reportsWhenCantFindTheSpecifiedLesson() {
        testDatabaseAdaptor.runQuery("""
                CREATE (c:Course {name: "Course", image: "img.png"})-[:HAS_TOPIC_LESSON {index: 0}]->(l:TopicLesson {name: "Lesson"})
                RETURN c,l;
                """)

        val response = lessonRequest("Course", "NonExistantLesson")

        assertThat(response.status.code, equalTo(404))
        assertThat(extractJsonBody(response)["cause"].toString().unquoted(), equalTo("NoSuchLesson"))
    }
}