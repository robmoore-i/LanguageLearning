class EnvironmentLoader(val environment: (String) -> String?) {
    fun getEnvironment(): AppEnvironment {
        val requiredVariables = mutableListOf("APP_SERVER_PORT", "APP_LEGACY_SERVER_PORT")

        val environmentMap = requiredVariables.associateWith(environment)
        val unsetVariables = environmentMap.filterValues { it == null }.keys
        if (unsetVariables.count() > 0) {
            val concatenated = unsetVariables.reduce { acc, v -> "$acc, $v" }
            throw MissingConfigurationException("Required environment variables not found: $concatenated")
        }

        return AppEnvironment(
            environmentMap["APP_SERVER_PORT"]!!.toInt(),
            environmentMap["APP_LEGACY_SERVER_PORT"]!!.toInt()
        )
    }
}

data class AppEnvironment(val serverPort: Int, val legacyServerPort: Int)

class MissingConfigurationException(msg: String) : Exception(msg)