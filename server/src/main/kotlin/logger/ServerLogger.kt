package logger

class ServerLogger {
    var history: String = ""

    fun log(msg: String) {
        println(msg)
        history += "\n$msg"
    }
}
