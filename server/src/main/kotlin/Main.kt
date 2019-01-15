/*Created on 15/01/19. */

fun main(args: Array<String>) {
    val APP_SERVER_PORT =
        System.getenv("APP_SERVER_PORT") ?: throw Exception("Required environment variables not found: APP_SERVER_PORT")
    val port = APP_SERVER_PORT.toInt()
    val server = Server(port)
    server.start()
}