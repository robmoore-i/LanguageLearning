package endpoints.courses

import endpoints.EndpointTestCase
import endpoints.IntegrationEndpointTestCase
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert.*
import org.junit.Test

class CorsTest : IntegrationEndpointTestCase() {
    @Test
    fun givesOkResponse() {
        testDatabaseAdaptor.runQuery("""
                CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
                CREATE (french:Course {name: "French", image: "flagFrance.png"})
                CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
                RETURN georgian,french,german;
                """.trimIndent())

        val response = coursesRequest()

        assertThat(response.status.code, CoreMatchers.equalTo(200))
    }

    @Test
    fun givesAccessControlAllowOriginCorsHeader() {
        testDatabaseAdaptor.runQuery("""
                CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
                CREATE (french:Course {name: "French", image: "flagFrance.png"})
                CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
                RETURN georgian,french,german;
                """.trimIndent())

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