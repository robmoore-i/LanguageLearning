package unit

import LegacyServer
import Server
import ServerLogger
import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import neo4j.DatabaseAdaptor
import org.hamcrest.CoreMatchers.containsString
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.junit.After
import org.junit.Before
import org.junit.Test

/*Created on 13/01/19. */
class ServerTest {
    private val logger = ServerLogger()

    private val port = 8000
    private val frontendPort = 3000

    private val serverUrl = "http://localhost:$port"
    private val client = JavaHttpClient()

    private val georgianCoursemetadataReq = Request(Method.GET, "$serverUrl/coursemetadata").query("course", "Georgian")

    private val mockLegacyServer = mock<LegacyServer> {
        on { handleCoursemetadata(georgianCoursemetadataReq) } doReturn Response(OK)
    }

    private val mockDbAdaptor = mock<DatabaseAdaptor> {
        on { allCourses() } doReturn listOf(Jackson { obj() })
    }

    private val server: Http4kServer = Server(port, mockLegacyServer, mockDbAdaptor, frontendPort, logger)

    @After
    fun tearDown() {
        server.stop()
    }

    @Before
    fun setUp() {
        server.start()
    }

    @Test
    fun logsInboundRequestMethodAndPathForCoursemetadataEndpoint() {
        client.invoke(georgianCoursemetadataReq)

        assertThat(logger.history, containsString("GET /coursemetadata"))
    }
}