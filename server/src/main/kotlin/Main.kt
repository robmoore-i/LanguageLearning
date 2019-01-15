/*Created on 15/01/19. */

fun main(args: Array<String>) {
    val APP_SERVER_PORT =
        System.getenv("APP_SERVER_PORT") ?: throw Exception("Required environment variables not found: APP_SERVER_PORT")
    val LEGACY_SERVER_PORT =
        System.getenv("APP_LEGACY_SERVER_PORT") ?: throw Exception("Required environment variables not found: APP_LEGACY_SERVER_PORT")

    val port = APP_SERVER_PORT.toInt()
    val legacyServerPort = LEGACY_SERVER_PORT.toInt()

    val server = Server(port, legacyServerPort)
    server.start()
}