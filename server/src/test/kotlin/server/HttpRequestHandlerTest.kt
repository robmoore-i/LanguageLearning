package server

import model.Lesson
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status
import org.junit.Test

class HttpRequestHandlerTest {
    @Test
    fun ifServerApiFindsNoSuchLessonThenCallsNotFoundWithReasonThatLessonNotFound() {
        val stubThrowingServerApi = object : TestServerApi() {
            override fun lesson(courseName: String, lessonName: String): Lesson {
                throw NoSuchLessonException()
            }
        }

        val mockResponseFactory = object : TestServerResponseFactory() {
            var notFoundCalledWith : String = ""

            override fun notFound(cause: String): Response {
                notFoundCalledWith = cause
                return Response(Status.NOT_FOUND)
            }
        }

        val httpRequestHandler = HttpRequestHandler(stubThrowingServerApi, mockResponseFactory)
        val requestForNonExistantLesson = Request(Method.POST, "...")
                .body("{\"courseName\":\"Georgian\", \"lessonName\":\"Non-existant Lesson\"}")

        httpRequestHandler.handleLesson(requestForNonExistantLesson)

        assertThat(mockResponseFactory.notFoundCalledWith, equalTo("NoSuchLesson"))
    }

    @Test
    fun ifCourseMetadataRequestMissingQueryParamReturnsBadRequestWithReasonThatRequestWasMissingQueryParam() {
        val dummyServerApi = TestServerApi()

        val mockResponseFactory = object : TestServerResponseFactory() {
            var badRequestCalledWith : String = ""

            override fun badRequest(cause: String): Response {
                badRequestCalledWith = cause
                return Response(Status.BAD_REQUEST)
            }
        }

        val httpRequestHandler = HttpRequestHandler(dummyServerApi, mockResponseFactory)
        val badCourseMetadataRequest = Request(Method.GET, "...")

        httpRequestHandler.handleCoursemetadata(badCourseMetadataRequest)

        assertThat(mockResponseFactory.badRequestCalledWith, equalTo("MissingQueryParam: course"))
    }
}