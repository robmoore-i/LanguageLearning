package neo4j

class Neo4jDatabaseAdaptor(private val neo4jDriver: Neo4jDriver, imagesPath: String, extractsPath: String) {
    fun allCourses(): Any {
        neo4jDriver.query("MATCH (c:Course) RETURN c")
        return 0
    }
}
