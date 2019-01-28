package environment

import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

/*Created on 15/01/19. */
class EnvironmentLoaderTest {
    @Test
    fun loadsTheRequiredVariables() {
        val environment = { varName: String ->
            val value = when (varName) {
                "APP_SERVER_PORT" -> "1"
                "APP_NEO4J_USER" -> "2"
                "APP_NEO4J_PW" -> "3"
                "APP_NEO4J_PORT" -> "4"
                "APP_FRONTEND_PORT" -> "5"
                "APP_IMAGES_PATH" -> "6"
                "APP_EXTRACTS_PATH" -> "7"
                else -> null
            }
            value
        }

        val environmentLoader = EnvironmentLoader(environment)

        val appEnv = environmentLoader.getEnvironment()

        assertThat(appEnv.serverPort, equalTo(1))
        assertThat(appEnv.neo4jUser, equalTo("2"))
        assertThat(appEnv.neo4jPassword, equalTo("3"))
        assertThat(appEnv.neo4jPort, equalTo(4))
        assertThat(appEnv.frontendPort, equalTo(5))
        assertThat(appEnv.imagesPath, equalTo("6"))
        assertThat(appEnv.extractsPath, equalTo("7"))
    }

    @Test(expected = MissingConfigurationException::class)
    fun throwsMissingConfigurationExceptionIfAVariableIsMissing() {
        val environment = { varName: String ->
            when (varName) {
                "APP_SERVER_PORT" -> "8000"
                "APP_NEO4J_PORT" -> null // Variable is missing
                else -> null
            }
        }

        val environmentLoader = EnvironmentLoader(environment)

        environmentLoader.getEnvironment()
    }
}