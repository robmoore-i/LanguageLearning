/*Created on 15/01/19. */
@file:JvmName("MainClass")

import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import server.LegacyServer
import server.Server

fun main(args: Array<String>) {
    val environmentLoader = EnvironmentLoader(System::getenv)
    val environment = environmentLoader.getEnvironment()

    val logger = ServerLogger()
    val legacyServer = LegacyServer(environment.legacyServerPort)

    val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)
    val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(neo4jDriver, environment.imagesPath, environment.extractsPath)

    val server = Server(environment.serverPort, legacyServer, neo4jDatabaseAdaptor, environment.frontendPort, logger)
    server.start()
}