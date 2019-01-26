package neo4j

import org.neo4j.driver.v1.Record
import org.neo4j.driver.v1.Value

class Neo4jDatabaseAdaptor(
    private val neo4jDriver: Neo4jDriver,
    private val imagesPath: String,
    private val extractsPath: String
) : DatabaseAdaptor {

    override fun allCourses(): List<Course> {
        val records = neo4jDriver.query("MATCH (c:Course) RETURN c")
        return records.map { record -> Course.fromNode(record.nodeInColumn(0), imagesPath) }
    }
}

fun Record.nodeInColumn(columnIndex: Int): Value {
    return this[columnIndex]
}