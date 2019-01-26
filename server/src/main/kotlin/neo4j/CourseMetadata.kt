package neo4j

import org.http4k.unquoted
import org.neo4j.driver.v1.Value

class CourseMetadata(valuePairs: List<Pair<Value, Value>>) {
    private val lessonMetadata: MutableList<LessonMetadata> = mutableListOf()

    init {
        valuePairs.withIndex().forEach { (i, valuePair) ->
            lessonMetadata.add(i, LessonMetadata(valuePair.first.toString().unquoted(), valuePair.second.asInt()))
        }
    }

    fun titleOfLessonAtIndex(i: Int): String {
        return lessonMetadata[i].lessonName
    }
}

data class LessonMetadata(val lessonName: String, val lessonIndex: Int)
