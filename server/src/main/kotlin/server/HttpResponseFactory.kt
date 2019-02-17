package server

import org.http4k.core.Response
import org.http4k.core.Status

class HttpResponseFactory(private val frontendPort: Int) {
    fun ok(json: String): Response {
        return Response(Status.OK)
                .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(json)
    }

    fun notFound(cause: String): Response {
        val jsonEncodedError = "{\"cause\":\"$cause\"}"
        return Response(Status.NOT_FOUND)
                .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(jsonEncodedError)
    }
}