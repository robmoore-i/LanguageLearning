package endpoints.courses

import endpoints.EndpointTestCase
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert
import org.junit.Test

class CorsTest : EndpointTestCase() {
    @Test
    fun givesOkResponse() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
                CREATE (french:Course {name: "French", image: "flagFrance.png"})
                CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
                RETURN georgian,french,german;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = coursesRequest()

        MatcherAssert.assertThat(response.status.code, CoreMatchers.equalTo(200))
    }

    @Test
    fun givesAccessControlAllowOriginCorsHeader() {
        neo4jDriver.session().let { session ->
            val query = """
                CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
                CREATE (french:Course {name: "French", image: "flagFrance.png"})
                CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
                RETURN georgian,french,german;
                """.trimIndent()

            session.run(query)
            session.close()
        }

        val response = coursesRequest()

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