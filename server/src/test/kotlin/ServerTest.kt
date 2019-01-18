import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import org.hamcrest.CoreMatchers.containsString
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.server.Http4kServer
import org.junit.After
import org.junit.Before
import org.junit.Test

/*Created on 13/01/19. */
class ServerTest {
    private val logger = ServerLogger()

    private val port = 8000
    private val serverUrl = "http://localhost:$port"
    private val client = JavaHttpClient()

    private val requestForGeorgianCourseMetadata =
        Request(Method.GET, "$serverUrl/coursemetadata").query("course", "Georgian")
    private val mockLegacyServer = mock<LegacyServer> {
        on { handleCoursemetadata(requestForGeorgianCourseMetadata) } doReturn Response(OK)
    }

    private val server: Http4kServer = Server(port, mockLegacyServer, logger)

    @After
    fun tearDown() {
        server.stop()
    }

    @Before
    fun setUp() {
        server.start()
    }

    @Test
    fun canPing() {
        val request = Request(Method.GET, "$serverUrl/heartbeat").query("heartbeat-token", "abc")
        val response: Response = client.invoke(request)

        assertThat(response.status.code, equalTo(200))
        assertThat(response.bodyString(), equalTo("abc"))
    }

    @Test
    fun logsInboundRequestMethodAndPathForHeartbeatEndpoint() {
        val request = Request(Method.GET, "$serverUrl/heartbeat").query("heartbeat-token", "memes")
        client.invoke(request)

        assertThat(logger.history, containsString("GET /heartbeat"))
    }

    @Test
    fun logsInboundRequestMethodAndPathForCoursemetadataEndpoint() {
        client.invoke(requestForGeorgianCourseMetadata)

        assertThat(logger.history, containsString("GET /coursemetadata"))
    }
}