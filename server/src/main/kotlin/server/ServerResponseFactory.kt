package server

import model.JsonEncodable
import org.http4k.core.Response

interface ServerResponseFactory {
    fun ok(jsonEncodable: JsonEncodable): Response
    fun ok(jsonEncodables: List<JsonEncodable>): Response
    fun notFound(cause: String): Response
}