package unit

import neo4j.Course
import neo4j.ImageType
import neo4j.neo4jCourseValue
import org.hamcrest.CoreMatchers.equalTo
import org.junit.Assert.assertThat
import org.junit.Test

class CourseTest {
    @Test
    fun canInitialiseFromNeo4jValue() {
        val neo4jCourseValue = neo4jCourseValue("Georgian", "georgian.svg")
        val course = Course.fromNeo4jValue(neo4jCourseValue, "images/")
        assertThat(course.name, equalTo("Georgian"))
        assertThat(course.fullImagePath, equalTo("images/georgian.svg"))
        assertThat(course.imageFileType, equalTo(ImageType.SVG))
    }
}