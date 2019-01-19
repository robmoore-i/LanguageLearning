/*Created on 15/01/19. */
@file:JvmName("MainClass")

import environment.EnvironmentLoader
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver

fun main(args: Array<String>) {
    val environmentLoader = EnvironmentLoader(System::getenv)
    val appEnvironment = environmentLoader.getEnvironment()

    val logger = ServerLogger()
    val legacyServer = LegacyServer(appEnvironment.legacyServerPort)
    val neo4jDriver = Neo4jDriver(appEnvironment.neo4jUser, appEnvironment.neo4jPassword, appEnvironment.neo4jPort)
    val neo4jDatabase = Neo4jDatabaseAdaptor(neo4jDriver, appEnvironment.imagesPath, appEnvironment.extractsPath)
    val server = Server(appEnvironment.serverPort, legacyServer, neo4jDatabase, logger)
    server.start()
}