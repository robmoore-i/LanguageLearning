package server

import logger.ServerLogger
import org.http4k.core.*
import org.http4k.filter.ServerFilters
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Http4kServer
import org.http4k.server.Jetty
import org.http4k.server.asServer

/*Created on 13/01/19. */
class HttpServer(
        httpRequestHandler: HttpRequestHandler,
        private val port: Int,
        private val logger: ServerLogger
) : Http4kServer {

    private val handler: HttpHandler = ServerFilters.CatchLensFailure.then(
        routes(
            "/courses" bind Method.GET to loggedResponse(httpRequestHandler::handleCourses),
            "/lesson" bind Method.POST to loggedResponse(httpRequestHandler::handleLesson),
            "/coursemetadata" bind Method.GET to loggedResponse(httpRequestHandler::handleCoursemetadata)
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