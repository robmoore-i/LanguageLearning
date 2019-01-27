package json

import com.fasterxml.jackson.databind.JsonNode
import model.CourseMetadata
import model.LessonMetadata
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.junit.Test
import server.JsonEncoder

class CourseMetadataEncodingTest {
    private val json = Jackson
    private val encoder = JsonEncoder()

    @Test
    fun canEncodeCourseMetadata() {
        val courseMetadata = CourseMetadata(
            mutableListOf(
                LessonMetadata("lesson-name-1", 0),
                LessonMetadata("lesson-name-2", 1),
                LessonMetadata("lesson-name-3", 2)
            )
        )

        val encoded = encoder.encodeCourseMetadata(courseMetadata)

        val node: JsonNode = json.parse(encoded)

        assertThat(node["lessonMetadata"].size(), equalTo(3))
        assertThat(node["lessonMetadata"][0]["name"].toString().unquoted(), equalTo("lesson-name-1"))
        assertThat(node["lessonMetadata"][1]["name"].toString().unquoted(), equalTo("lesson-name-2"))
        assertThat(node["lessonMetadata"][2]["name"].toString().unquoted(), equalTo("lesson-name-3"))
        assertThat(node["lessonMetadata"][0]["index"].asInt(), equalTo(0))
        assertThat(node["lessonMetadata"][1]["index"].asInt(), equalTo(1))
        assertThat(node["lessonMetadata"][2]["index"].asInt(), equalTo(2))
    }
}