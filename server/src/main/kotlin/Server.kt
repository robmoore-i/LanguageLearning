import org.http4k.core.*
import org.http4k.core.Status.Companion.OK
import org.http4k.filter.ServerFilters
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Http4kServer
import org.http4k.server.Jetty
import org.http4k.server.asServer

/*Created on 13/01/19. */
class Server(private val port: Int, legacyServerPort: Int, logger: ServerLogger) : Http4kServer {
    private val legacyServer = LegacyServer(legacyServerPort)

    private val handler: HttpHandler = ServerFilters.CatchLensFailure.then(
        routes(
            "/heartbeat" bind Method.GET to { request: Request -> Response(OK).body(request.query("heartbeat-token").toString()) },
            "/courses" bind Method.GET to { legacyServer.handleCourses() },
            "/lesson" bind Method.POST to { request: Request -> legacyServer.handleLesson(request) },
            "/coursemetadata" bind Method.GET to { request: Request -> legacyServer.handleCoursemetadata(request) }
        )
    )

    private val server = handler.asServer(Jetty(port))

    override fun port(): Int {
        return port
    }

    override fun start(): Http4kServer {
        return server.start()
    }

    override fun stop(): Http4kServer {
        return server.stop()
    }
}