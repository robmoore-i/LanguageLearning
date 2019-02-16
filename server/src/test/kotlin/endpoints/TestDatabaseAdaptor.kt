package endpoints

import server.DatabaseAdaptor

interface TestDatabaseAdaptor : DatabaseAdaptor {
    fun runQuery(query: String)
}
