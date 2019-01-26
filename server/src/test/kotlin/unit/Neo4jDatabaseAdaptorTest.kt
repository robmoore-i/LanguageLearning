package unit

import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import neo4j.*
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test
import org.mockito.ArgumentMatchers.anyMap
import org.mockito.ArgumentMatchers.anyString
import org.neo4j.driver.v1.Value

class Neo4jDatabaseAdaptorTest {
    @Test
    fun canMapNodesToCourses() {
        val mockNodes: List<Value> = listOf(
            neo4jCourseValue("course-1", "image-relative-path-1.svg"),
            neo4jCourseValue("course-2", "image-relative-path-2.png"),
            neo4jCourseValue("course-3", "image-relative-path-3.jpg")
        )

        val mockNeo4jDriver = mock<Neo4jDriver> {
            on { queryValues(anyString()) } doReturn mockNodes
        }

        val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(mockNeo4jDriver, "images/", "extracts/")

        val allCourses: List<Course> = neo4jDatabaseAdaptor.allCourses()

        assertThat(allCourses, hasItem(Course("course-1", "images/image-relative-path-1.svg", ImageType.SVG)))
        assertThat(allCourses, hasItem(Course("course-2", "images/image-relative-path-2.png", ImageType.PNG)))
        assertThat(allCourses, hasItem(Course("course-3", "images/image-relative-path-3.jpg", ImageType.JPG)))
    }

    @Test
    fun canGetAllLessonIndices() {
        val mockValuePairs: List<Pair<Value, Value>> = listOf(
            Pair(stringValue("First"), intValue(0)),
            Pair(stringValue("Second"), intValue(1)),
            Pair(stringValue("Third"), intValue(2))
        )

        val mockNeo4jDriver = mock<Neo4jDriver> {
            on { queryTwoValuesWithParams(anyString(), anyMap()) } doReturn mockValuePairs
        }

        val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(mockNeo4jDriver, "images/", "extracts/")

        val courseMetadata: CourseMetadata = neo4jDatabaseAdaptor.courseMetadata("Course")

        assertThat(courseMetadata.titleOfLessonAtIndex(0), equalTo("First"))
        assertThat(courseMetadata.titleOfLessonAtIndex(1), equalTo("Second"))
        assertThat(courseMetadata.titleOfLessonAtIndex(2), equalTo("Third"))
    }
}