import org.hamcrest.CoreMatchers.containsString
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.client.JavaHttpClient
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.server.Http4kServer
import org.junit.After
import org.junit.Before
import org.junit.Test

/*Created on 13/01/19. */
class ServerTest {
    private val port = 8000
    private val legacyServerPort = 7000
    private val logger = ServerLogger()
    private val server: Http4kServer = Server(port, legacyServerPort, logger)
    private val serverUrl = "http://localhost:$port"
    private val client = JavaHttpClient()

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
    fun logsInboundRequestMethodAndPath() {
        val request = Request(Method.GET, "$serverUrl/heartbeat").query("heartbeat-token", "memes")
        client.invoke(request)

        assertThat(logger.history, containsString("GET /heartbeat"))
    }
}