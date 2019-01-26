package neo4j

import org.neo4j.driver.internal.value.IntegerValue
import org.neo4j.driver.internal.value.MapValue
import org.neo4j.driver.internal.value.StringValue
import org.neo4j.driver.v1.*
import java.util.*

open class Neo4jDriver(user: String, password: String, boltPort: Int) {
    private val uri = "bolt://$user:$password@localhost:$boltPort"
    private val driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password))

    open fun queryValues(query: String): List<Value> {
        return driver.session().readTransaction { tx -> tx.run(query).list() }.map { record -> record.valueInColumn(0) }
    }

    fun session(): Session {
        return driver.session()
    }

    open fun queryTwoValuesWithParams(query: String, params: Map<String, String>): List<Pair<Value, Value>> {
        return driver.session().readTransaction { tx -> tx.run(query, params).list() }
            .map { record: Record -> Pair(record.valueInColumn(0), record.valueInColumn(1)) }
    }
}

fun Record.valueInColumn(columnIndex: Int): Value {
    return this[columnIndex]
}

fun stringValue(s: String): Value {
    return StringValue(s)
}

fun intValue(i: Int): Value {
    return IntegerValue(i.toLong())
}

fun mapValue(vararg pairs: Pair<String, Value>): Value {
    val hashMap = HashMap<String, Value>()
    for (pair in pairs) {
        hashMap[pair.first] = pair.second
    }
    return MapValue(hashMap)
}

fun neo4jCourseValue(courseName: String, imageFileRelativePath: String): Value {
    return mapValue("name" to stringValue(courseName), "image" to stringValue(imageFileRelativePath))
}