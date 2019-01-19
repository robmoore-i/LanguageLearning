import org.http4k.core.*
import org.http4k.filter.ServerFilters
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Http4kServer
import org.http4k.server.Jetty
import org.http4k.server.asServer

/*Created on 13/01/19. */
class Server(private val port: Int, legacyServer: LegacyServer, private val logger: ServerLogger) : Http4kServer {
    private val serverApi = ServerApi(legacyServer)

    private val handler: HttpHandler = ServerFilters.CatchLensFailure.then(
        routes(
                "/courses" bind Method.GET to loggedResponse(serverApi::handleCourses),
                "/lesson" bind Method.POST to loggedResponse(serverApi::handleLesson),
                "/coursemetadata" bind Method.GET to loggedResponse(serverApi::handleCoursemetadata)
        )
    )

    private val server = handler.asServer(Jetty(port))

    private fun loggedResponse(handler: (Request) -> Response): (Request) -> Response {
        return { request: Request ->
            logger.log("${request.method} ${request.uri.path}")
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

class ServerApi(private val legacyServer: LegacyServer) {
    fun handleCourses(request: Request): Response {
        return legacyServer.handleCourses(request)
    }

    fun handleLesson(request: Request): Response {
        return legacyServer.handleLesson(request)
    }

    fun handleCoursemetadata(request: Request): Response {
        return legacyServer.handleCoursemetadata(request)
    }
}
