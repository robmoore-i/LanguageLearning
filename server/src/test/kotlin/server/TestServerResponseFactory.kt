package server

import model.JsonEncodable
import org.http4k.core.Response

open class TestServerResponseFactory : ServerResponseFactory {
    override fun ok(jsonEncodable: JsonEncodable): Response {
        throw Exception("Either should have not been called or been overriden")
    }

    override fun ok(jsonEncodables: List<JsonEncodable>): Response {
        throw Exception("Either should have not been called or been overriden")
    }

    override fun notFound(cause: String): Response {
        throw Exception("Either should have not been called or been overriden")
    }

    override fun badRequest(cause: String): Response {
        throw Exception("Either should have not been called or been overriden")
    }
}