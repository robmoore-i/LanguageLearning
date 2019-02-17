package server

import model.JsonEncodable
import org.http4k.core.Response
import org.http4k.core.Status

class HttpResponseFactory(private val frontendPort: Int) : ServerResponseFactory {
    private val jsonEncoder = JsonEncoder()

    override fun ok(jsonEncodable: JsonEncodable): Response {
        val json = jsonEncoder.encode(jsonEncodable)
        return Response(Status.OK)
                .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(json)
    }

    override fun ok(jsonEncodables: List<JsonEncodable>): Response {
        val json = jsonEncoder.encode(jsonEncodables)
        return Response(Status.OK)
                .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(json)
    }

    override fun notFound(cause: String): Response {
        val jsonEncodedError = "{\"cause\":\"$cause\"}"
        return Response(Status.NOT_FOUND)
                .header("Access-Control-Allow-Origin", "http://localhost:$frontendPort")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(jsonEncodedError)
    }
}