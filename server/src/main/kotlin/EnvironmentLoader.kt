class EnvironmentLoader(val environment: (String) -> String?) {
    fun getEnvironment(): AppEnvironment {
        val APP_SERVER_PORT =
            environment("APP_SERVER_PORT")
                ?: throw MissingConfigurationException("Required environment variables not found: APP_SERVER_PORT")
        val LEGACY_SERVER_PORT =
            environment("APP_LEGACY_SERVER_PORT")
                ?: throw MissingConfigurationException("Required environment variables not found: APP_LEGACY_SERVER_PORT")

        return AppEnvironment(APP_SERVER_PORT.toInt(), LEGACY_SERVER_PORT.toInt())
    }
}

data class AppEnvironment(val serverPort: Int, val legacyServerPort: Int)

class MissingConfigurationException(msg: String) : Exception(msg)