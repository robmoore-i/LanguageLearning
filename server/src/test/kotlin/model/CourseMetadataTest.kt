package model

import neo4j.intValue
import neo4j.stringValue
import org.hamcrest.CoreMatchers.equalTo
import org.junit.Assert.assertThat
import org.junit.Test
import org.neo4j.driver.v1.Value

class CourseMetadataTest {
    @Test
    fun canInitialiseFromNeo4jValuePairsWithAFewLessons() {
        val valuePairs: List<Pair<Value, Value>> = listOf(
            Pair(stringValue("lesson-name-1"), intValue(0)),
            Pair(stringValue("lesson-name-2"), intValue(1)),
            Pair(stringValue("lesson-name-3"), intValue(2))
        )

        val courseMetadata = CourseMetadata.fromNeo4jValuePairs(valuePairs)

        assertThat(courseMetadata.numberOfLessons(), equalTo(3))
        assertThat(courseMetadata.titleOfLessonAtIndex(0), equalTo("lesson-name-1"))
        assertThat(courseMetadata.titleOfLessonAtIndex(1), equalTo("lesson-name-2"))
        assertThat(courseMetadata.titleOfLessonAtIndex(2), equalTo("lesson-name-3"))
    }

    @Test
    fun canInitialiseFromNeo4jValuePairsWithNoLessons() {
        val valuePairs: List<Pair<Value, Value>> = listOf()

        val courseMetadata = CourseMetadata.fromNeo4jValuePairs(valuePairs)

        assertThat(courseMetadata.numberOfLessons(), equalTo(0))
    }
}