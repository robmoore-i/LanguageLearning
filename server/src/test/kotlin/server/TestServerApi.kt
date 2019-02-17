package server

import model.Course
import model.CourseMetadata
import model.Lesson

open class TestServerApi : ServerApi {
    override fun courses(): List<Course> {
        throw Exception("Either should have not been called or been overriden")
    }

    override fun courseMetadata(courseName: String): CourseMetadata {
        throw Exception("Either should have not been called or been overriden")
    }

    override fun lesson(courseName: String, lessonName: String): Lesson {
        throw Exception("Either should have not been called or been overriden")
    }
}