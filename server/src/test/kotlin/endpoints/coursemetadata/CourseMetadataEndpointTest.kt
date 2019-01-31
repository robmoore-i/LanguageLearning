package endpoints.coursemetadata


import com.fasterxml.jackson.databind.JsonNode
import endpoints.EndpointTestCase
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.unquoted
import org.junit.Test

class CourseMetadataEndpointTest : EndpointTestCase() {

    @Test
    fun canGetLessonOrderForACourse() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "Course", image: "flagGeorgia.svg"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
                RETURN hello,whatAreYouCalled,colours,c;
                """

            session.run(query)
            session.close()
        }

        val responseJson = courseMetadataRequestJson("Course")
        val lessonMetadata = responseJson["lessonMetadata"]

        assertLessonHasIndex(lessonMetadata, "Hello", 0)
        assertLessonHasIndex(lessonMetadata, "What are you called?", 1)
        assertLessonHasIndex(lessonMetadata, "Colours", 2)
    }

    private fun assertLessonHasIndex(lessonMetadata: JsonNode, lessonName: String, index: Int) {
        assertThat(getNodeWithName(lessonMetadata, lessonName)["index"].asInt(), equalTo(index))
    }

    private fun getNodeWithName(lessonMetadata: JsonNode, nodeName: String): JsonNode {
        return lessonMetadata.first { node -> node["name"].toString().unquoted() == nodeName }
    }

    private fun courseMetadataRequestJson(courseName: String): JsonNode {
        val response = courseMetadataRequest(this, courseName)
        return json.parse(response.bodyString())
    }
}

fun courseMetadataRequest(endpointTestCase: EndpointTestCase, courseName: String): Response {
    val request = Request(Method.GET, "${endpointTestCase.serverUrl}/coursemetadata?course=$courseName")
    return endpointTestCase.client.invoke(request)
}