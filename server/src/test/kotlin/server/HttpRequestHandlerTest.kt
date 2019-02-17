package server

import model.Course
import model.CourseMetadata
import model.JsonEncodable
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
        val stubThrowingServerApi = object : ServerApi {
            override fun courses(): List<Course> { return listOf() }

            override fun courseMetadata(courseName: String): CourseMetadata { return CourseMetadata(mutableListOf()) }

            override fun lesson(courseName: String, lessonName: String): Lesson {
                throw NoSuchLessonException()
            }
        }

        val mockResponseFactory = object : ServerResponseFactory {
            var notFoundCalledWith : String = ""

            override fun ok(jsonEncodable: JsonEncodable): Response { return Response(Status.OK) }

            override fun ok(jsonEncodables: List<JsonEncodable>): Response { return Response(Status.OK) }

            override fun badRequest(cause: String): Response { return Response(Status.BAD_REQUEST) }

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
        val dummyServerApi = object : ServerApi {
            override fun courses(): List<Course> { return listOf() }

            override fun courseMetadata(courseName: String): CourseMetadata { return CourseMetadata(mutableListOf()) }

            override fun lesson(courseName: String, lessonName: String): Lesson { return Lesson("", "", 0, listOf()) }
        }

        val mockResponseFactory = object : ServerResponseFactory {
            var badRequestCalledWith : String = ""

            override fun ok(jsonEncodable: JsonEncodable): Response { return Response(Status.OK) }

            override fun ok(jsonEncodables: List<JsonEncodable>): Response { return Response(Status.OK) }

            override fun notFound(cause: String): Response { return Response(Status.NOT_FOUND) }

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