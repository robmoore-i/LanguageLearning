package neo4j

import com.fasterxml.jackson.databind.JsonNode

/*Created on 19/01/19. */
interface DatabaseAdaptor {
    fun allCourses(): List<JsonNode>
}