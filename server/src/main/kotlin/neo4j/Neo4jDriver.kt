package neo4j

import org.neo4j.driver.v1.*

open class Neo4jDriver(user: String, password: String, boltPort: Int) {
    private val uri = "bolt://$user:$password@localhost:$boltPort"
    private val driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password))

    open fun queryNodes(query: String): List<Value> {
        return driver.session().readTransaction { tx -> tx.run(query).list() }.map { record -> record.nodeInColumn(0) }
    }

    fun session(): Session {
        return driver.session()
    }
}

fun Record.nodeInColumn(columnIndex: Int): Value {
    return this[columnIndex]
}