package model

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.neo4j.driver.v1.Value

class CourseMetadata(private val lessonMetadata: MutableList<LessonMetadata>) {
    private val json = Jackson

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

    fun numberOfLessons(): Int {
        return lessonMetadata.size
    }

    companion object {
        fun fromNeo4jValuePairs(valuePairs: List<Pair<Value, Value>>): CourseMetadata {
            val lessonMetadata: MutableList<LessonMetadata> = mutableListOf()
            valuePairs.withIndex().forEach { (i, valuePair) ->
                lessonMetadata.add(i,
                    LessonMetadata(valuePair.first.toString().unquoted(), valuePair.second.asInt())
                )
            }
            return CourseMetadata(lessonMetadata)
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
