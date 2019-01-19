package neo4j

import org.neo4j.driver.v1.AuthTokens
import org.neo4j.driver.v1.GraphDatabase
import org.neo4j.driver.v1.Record


class Neo4jDriver(user: String, password: String, boltPort: Int) {
    val uri = "bolt://$user:$password@localhost:$boltPort"
    val driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password))

    fun query(query: String): MutableIterable<Record> {
        return driver.session().readTransaction { tx -> tx.run(query).list() }
    }
}
