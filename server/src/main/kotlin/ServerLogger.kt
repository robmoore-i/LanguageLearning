class ServerLogger {
    var history: String = "GET /heartbeat"

    fun log(msg: String) {
        history += "\n$msg"
    }
}
