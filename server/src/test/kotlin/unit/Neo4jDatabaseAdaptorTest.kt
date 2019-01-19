package unit

import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.verify
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.junit.Test
import org.mockito.ArgumentMatchers.anyString

/*Created on 19/01/19. */
class Neo4jDatabaseAdaptorTest {
    @Test
    fun queriesNeo4jForAllCourses() {
        val mockNeo4jDriver = mock<Neo4jDriver> {}
        val databaseAdaptor = Neo4jDatabaseAdaptor(mockNeo4jDriver, "imagesPath", "extractsPath")

        databaseAdaptor.allCourses()

        verify(mockNeo4jDriver).query(anyString())
    }
}