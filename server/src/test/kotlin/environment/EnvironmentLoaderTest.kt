package environment

import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.Test

/*Created on 15/01/19. */
class EnvironmentLoaderTest {
    @Test
    fun loadsAllVariablesIfTheyAreThere() {
        val environment = { varName: String ->
            when (varName) {
                "APP_SERVER_PORT" -> "8000"
                "APP_LEGACY_SERVER_PORT" -> "7000"
                else -> "123" // This is laziness.
            }
        }

        val environmentLoader = EnvironmentLoader(environment)

        val appEnv = environmentLoader.getEnvironment()

        assertThat(appEnv.serverPort, equalTo(8000))
        assertThat(appEnv.legacyServerPort, equalTo(7000))
    }

    @Test(expected = MissingConfigurationException::class)
    fun throwsMissingConfigurationExceptionIfAVariableIsMissing() {
        val environment = { varName: String ->
            when (varName) {
                "APP_SERVER_PORT" -> "8000"
                "APP_LEGACY_SERVER_PORT" -> null // Variable is missing
                else -> null
            }
        }

        val environmentLoader = EnvironmentLoader(environment)

        environmentLoader.getEnvironment()
    }
}