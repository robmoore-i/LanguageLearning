package neo4j

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.neo4j.driver.v1.Value

class CourseMetadata(valuePairs: List<Pair<Value, Value>>) {
    private val json = Jackson
    private val lessonMetadata: MutableList<LessonMetadata> = mutableListOf()

    init {
        valuePairs.withIndex().forEach { (i, valuePair) ->
            lessonMetadata.add(i, LessonMetadata(valuePair.first.toString().unquoted(), valuePair.second.asInt()))
        }
    }

    fun titleOfLessonAtIndex(i: Int): String {
        return lessonMetadata[i].lessonName
    }

    fun jsonify(): JsonNode {
        return json {
            obj(
                "lessonMetadata" to array(lessonMetadata.map(LessonMetadata::jsonify))
            )
        }
    }
}

data class LessonMetadata(val lessonName: String, val lessonIndex: Int) {
    private val json = Jackson

    fun jsonify(): JsonNode {
        return json {
            obj("name" to string(lessonName), "index" to number(lessonIndex))
        }
    }
}
