package endpoints

import org.http4k.core.Response

// NB. As long as TDD is employed, this interface will always mirror that of the DatabaseServingApi class.
interface TestServerClient {
    fun courses(): Response
    fun courseMetadata(courseName: String): Response
    fun lesson(courseName: String, lessonName: String): Response
}
