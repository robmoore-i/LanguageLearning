package endpoints

import server.DatabaseAdaptor

interface TestDatabaseAdaptor : DatabaseAdaptor {
    fun clearDatabase()
    fun runQuery(query: String)
}
