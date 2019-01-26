package neo4j

/*Created on 19/01/19. */
interface DatabaseAdaptor {
    fun allCourses(): List<Course>
    fun courseMetadata(courseName: String): CourseMetadata
}