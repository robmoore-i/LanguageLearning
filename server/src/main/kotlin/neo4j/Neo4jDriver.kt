package neo4j

import org.neo4j.driver.v1.AuthTokens
import org.neo4j.driver.v1.GraphDatabase
import org.neo4j.driver.v1.Record

open class Neo4jDriver(user: String, password: String, boltPort: Int) {
    private val uri = "bolt://$user:$password@localhost:$boltPort"
    private val driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password))

    open fun query(query: String): MutableIterable<Record> {
        return driver.session().readTransaction { tx -> tx.run(query).list() }
    }

    fun queryWithParams(query: String, params: Map<String, String>): MutableIterable<Record> {
        return driver.session().readTransaction { tx -> tx.run(query, params).list() }
    }
}
