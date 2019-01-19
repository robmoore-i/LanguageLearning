/*Created on 15/01/19. */
@file:JvmName("MainClass")

import environment.EnvironmentLoader

fun main(args: Array<String>) {
    val environmentLoader = EnvironmentLoader(System::getenv)
    val appEnvironment = environmentLoader.getEnvironment()

    val logger = ServerLogger()
    val legacyServer = LegacyServer(appEnvironment.legacyServerPort)
    val server = Server(appEnvironment.serverPort, legacyServer, logger)
    server.start()
}