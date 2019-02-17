package server

import com.fasterxml.jackson.databind.JsonNode
import model.Course
import model.CourseMetadata
import model.JsonEncodable
import model.Lesson

class JsonEncoder {
    fun encodeCourses(courses: List<Course>): String {
        val coursesJsonObjects: List<JsonNode> = courses.map { course -> course.jsonify() }
        return encodeArray(coursesJsonObjects)
    }

    private fun encodeArray(nodes: List<JsonNode>): String {
        val stringBuilder = StringBuilder().append("[")
        for (node in nodes) {
            val stringCourse = node.toString()
            stringBuilder.append(stringCourse).append(",")
        }
        return stringBuilder.toString().dropLast(1) + "]"
    }

    fun encodeCourseMetadata(courseMetadata: CourseMetadata): String {
        return courseMetadata.jsonify().toString()
    }

    fun encodeLesson(lesson: Lesson): String {
        return lesson.jsonify().toString()
    }

    fun encode(jsonEncodable: JsonEncodable) : String {
        return jsonEncodable.jsonify().toString()
    }
}
