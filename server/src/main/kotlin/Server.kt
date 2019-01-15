import org.http4k.core.*
import org.http4k.core.Status.Companion.OK
import org.http4k.filter.ServerFilters
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Http4kServer
import org.http4k.server.Jetty
import org.http4k.server.asServer

/*Created on 13/01/19. */
class Server(private val port: Int, legacyServerPort: Int, val logger: ServerLogger) : Http4kServer {
    private val legacyServer = LegacyServer(legacyServerPort)

    private val handleHearbeat = { request: Request -> Response(OK).body(request.query("heartbeat-token").toString()) }

    private val handler: HttpHandler = ServerFilters.CatchLensFailure.then(
        routes(
            "/heartbeat" bind Method.GET to loggedResponse(handleHearbeat),
            "/courses" bind Method.GET to loggedResponse(legacyServer::handleCourses),
            "/lesson" bind Method.POST to loggedResponse(legacyServer::handleLesson),
            "/coursemetadata" bind Method.GET to loggedResponse(legacyServer::handleCoursemetadata)
        )
    )

    private val server = handler.asServer(Jetty(port))

    private fun loggedResponse(handler: (Request) -> Response): (Request) -> Response {
        return { request: Request ->
            logger.log("$request.method /${request.uri.path}")
            handler(request)
        }
    }

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