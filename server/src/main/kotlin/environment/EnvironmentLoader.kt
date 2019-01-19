package environment

class EnvironmentLoader(private val environment: (String) -> String?) {
    fun getEnvironment(): AppEnvironment {
        val requiredVariables = mutableListOf(
            "APP_SERVER_PORT",
            "APP_LEGACY_SERVER_PORT",
            "APP_NEO4J_USER",
            "APP_NEO4J_PW",
            "APP_NEO4J_PORT",
            "APP_FRONTEND_PORT",
            "APP_IMAGES_PATH",
            "APP_EXTRACTS_PATH"
        )

        val environmentMap = readEnvironment(requiredVariables)

        return AppEnvironment(
            intVariable(environmentMap, "APP_SERVER_PORT"),
            intVariable(environmentMap, "APP_LEGACY_SERVER_PORT"),
            stringVariable(environmentMap, "APP_NEO4J_USER"),
            stringVariable(environmentMap, "APP_NEO4J_PW"),
            intVariable(environmentMap, "APP_NEO4J_PORT"),
            intVariable(environmentMap, "APP_FRONTEND_PORT"),
            stringVariable(environmentMap, "APP_IMAGES_PATH"),
            stringVariable(environmentMap, "APP_EXTRACTS_PATH")
        )
    }

    private fun readEnvironment(requiredVariables: MutableList<String>): Map<String, String?> {
        val environmentMap = requiredVariables.associateWith(environment)
        val unsetVariables = environmentMap.filterValues { it == null }.keys
        if (unsetVariables.count() > 0) {
            val concatenated = unsetVariables.reduce { acc, v -> "$acc, $v" }
            throw MissingConfigurationException("Required environment variables not found: $concatenated")
        }
        return environmentMap
    }

    private fun intVariable(environmentMap: Map<String, String?>, variableName: String): Int {
        return environmentMap[variableName]!!.toInt()
    }

    private fun stringVariable(environmentMap: Map<String, String?>, variableName: String): String {
        return environmentMap[variableName]!!.toString()
    }
}

data class AppEnvironment(
    val serverPort: Int,
    val legacyServerPort: Int,
    val neo4jUser: String,
    val neo4jPassword: String,
    val neo4jPort: Int,
    val frontendPort: Int,
    val imagesPath: String,
    val extractsPath: String
)

class MissingConfigurationException(msg: String) : Exception(msg)