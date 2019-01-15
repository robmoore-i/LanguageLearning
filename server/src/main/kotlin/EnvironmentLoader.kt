class EnvironmentLoader(val environment: (String) -> String?) {
    fun getEnvironment(): Pair<Int, Int> {
        val APP_SERVER_PORT =
            environment("APP_SERVER_PORT")
                ?: throw MissingConfigurationException("Required environment variables not found: APP_SERVER_PORT")
        val LEGACY_SERVER_PORT =
            environment("APP_LEGACY_SERVER_PORT")
                ?: throw MissingConfigurationException("Required environment variables not found: APP_LEGACY_SERVER_PORT")

        val port = APP_SERVER_PORT.toInt()
        val legacyServerPort = LEGACY_SERVER_PORT.toInt()

        return Pair(port, legacyServerPort)
    }
}
