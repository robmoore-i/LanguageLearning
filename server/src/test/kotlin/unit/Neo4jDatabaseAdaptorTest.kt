package unit

import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import neo4j.*
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test
import org.mockito.ArgumentMatchers.anyString
import org.neo4j.driver.v1.Value

class Neo4jDatabaseAdaptorTest {
    @Test
    fun canMapNodesToCourses() {
        val mockNodes: List<Value> = listOf(
            neo4jCourseNode("course-1", "image-relative-path-1.svg"),
            neo4jCourseNode("course-2", "image-relative-path-2.png"),
            neo4jCourseNode("course-3", "image-relative-path-3.jpg")
        )

        val mockNeo4jDriver = mock<Neo4jDriver> {
            on { queryNodes(anyString()) } doReturn mockNodes
        }

        val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(mockNeo4jDriver, "images/", "extracts/")

        val allCourses: List<Course> = neo4jDatabaseAdaptor.allCourses()

        assertThat(allCourses, hasItem(Course("course-1", "images/image-relative-path-1.svg", ImageType.SVG)))
        assertThat(allCourses, hasItem(Course("course-2", "images/image-relative-path-2.png", ImageType.PNG)))
        assertThat(allCourses, hasItem(Course("course-3", "images/image-relative-path-3.jpg", ImageType.JPG)))
    }

    private fun neo4jCourseNode(courseName: String, imageFileRelativePath: String): Value {
        return mapValue("name" to stringValue(courseName), "image" to stringValue(imageFileRelativePath))
    }
}