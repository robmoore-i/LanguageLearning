package unit

import neo4j.Course
import neo4j.ImageType
import neo4j.mapValue
import neo4j.stringValue
import org.hamcrest.CoreMatchers.equalTo
import org.junit.Assert.assertThat
import org.junit.Test
import org.neo4j.driver.v1.Value

class CourseTest {
    @Test
    fun canInitialiseFromNeo4jValue() {
        val neo4jCourseNode = neo4jCourseNode("Georgian", "georgian.svg")
        val course = Course.fromNeo4jNode(neo4jCourseNode, "images/")
        assertThat(course.name, equalTo("Georgian"))
        assertThat(course.fullImagePath, equalTo("images/georgian.svg"))
        assertThat(course.imageFileType, equalTo(ImageType.SVG))
    }

    private fun neo4jCourseNode(courseName: String, imageFileRelativePath: String): Value {
        return mapValue("name" to stringValue(courseName), "image" to stringValue(imageFileRelativePath))
    }
}