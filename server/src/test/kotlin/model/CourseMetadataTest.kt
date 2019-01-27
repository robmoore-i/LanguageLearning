package model

import org.hamcrest.CoreMatchers.equalTo
import org.junit.Assert.assertThat
import org.junit.Test
import org.neo4j.driver.v1.Value

class CourseMetadataTest {
    @Test
    fun canInitialiseFromNeo4jValuePairsWithNoLessons() {
        val valuePairs: List<Pair<Value, Value>> = listOf()

        val courseMetadata = CourseMetadata.fromNeo4jValuePairs(valuePairs)

        assertThat(courseMetadata.numberOfLessons(), equalTo(0))
    }
}