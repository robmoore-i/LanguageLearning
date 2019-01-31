package endpoints.lesson

import endpoints.EndpointTestCase
import org.junit.Test

class CorsTest : EndpointTestCase() {

    @Test
    fun givesAccessControlAllowOriginCorsHeader() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (hello:TopicLesson {name: "lesson"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "Georgian", image: "img.png"})
                CREATE (hello)-[:HAS_QUESTION {index: 0}]->(letterA:Question:MultipleChoiceQuestion {question: "sounds like \"a\" in English", a: "მ",b:"ბ", c:"ა", answer: "c"})
                RETURN hello,letterA,c;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = lessonRequest("Georgian", "lesson")

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