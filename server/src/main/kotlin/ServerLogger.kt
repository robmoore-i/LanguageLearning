class ServerLogger {
    var history: String = "GET /heartbeat"

    fun log(msg: String) {
        println(msg)
        history += "\n$msg"
    }
}
