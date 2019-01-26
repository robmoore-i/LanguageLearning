package neo4j

class Neo4jDatabaseAdaptor(
    private val neo4jDriver: Neo4jDriver,
    private val imagesPath: String,
    private val extractsPath: String
) : DatabaseAdaptor {

    override fun allCourses(): List<Course> {
        val nodes = neo4jDriver.queryNodes("MATCH (c:Course) RETURN c")
        return nodes.map { node -> Course.fromNeo4jNode(node, imagesPath) }
    }
}

