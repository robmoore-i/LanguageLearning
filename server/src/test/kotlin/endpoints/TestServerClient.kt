package endpoints

import org.http4k.core.Response

interface TestServerClient {
    fun courses(): Response
    fun courseMetadata(courseName: String): Response
    fun lesson(courseName: String, lessonName: String): Response
}
