package endpoints.coursemetadata

import endpoints.EndpointTestCase
import org.junit.Test

class CorsTest : EndpointTestCase() {
    @Test
    fun givesAccessControlAllowOriginCorsHeader() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (c:Course {name: "Course", image: "flagGeorgia.svg"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
                RETURN hello,whatAreYouCalled,colours,c;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = courseMetadataRequest("Course")

        assertHasHeader(
            response,
            "Access-Control-Allow-Origin",
            "http://localhost:${environment.frontendPort}"
        )
        assertHasHeader(
            response,
            "Access-Control-Allow-Headers",
            "Content-Type"
        )
        assertHasHeader(
            response,
            "Content-Type",
            "application/json;charset=utf-8"
        )
    }
}