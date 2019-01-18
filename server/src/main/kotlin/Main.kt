/*Created on 15/01/19. */
@file:JvmName("MainClass")

fun main(args: Array<String>) {
    val environmentLoader = EnvironmentLoader(System::getenv)
    val (port, legacyServerPort) = environmentLoader.getEnvironment()

    val logger = ServerLogger()
    val legacyServer = LegacyServer(legacyServerPort)
    val server = Server(port, legacyServer, logger)
    server.start()
}