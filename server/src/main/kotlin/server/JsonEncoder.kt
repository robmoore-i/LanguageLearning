package server

import com.fasterxml.jackson.databind.JsonNode
import neo4j.Course
import neo4j.CourseMetadata

class JsonEncoder {
    fun encodeCourses(courses: List<Course>): String {
        val coursesJsonObjects: List<JsonNode> = courses.map { course -> course.jsonify() }
        return encodeArray(coursesJsonObjects)
    }

    fun encodeCourseMetadata(courseMetadata: CourseMetadata): String {
        return courseMetadata.jsonify().toString()
    }

    private fun encodeArray(nodes: List<JsonNode>): String {
        val stringBuilder = StringBuilder().append("[")
        for (node in nodes) {
            val stringCourse = node.toString()
            stringBuilder.append(stringCourse).append(",")
        }
        return stringBuilder.toString().dropLast(1) + "]"
    }
}
