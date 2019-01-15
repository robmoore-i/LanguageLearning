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
                else -> null
            }
        }

        val environmentLoader = EnvironmentLoader(environment)

        val (serverPort: Int, legacyServerPort: Int) = environmentLoader.getEnvironment()

        assertThat(serverPort, equalTo(8000))
        assertThat(legacyServerPort, equalTo(7000))
    }
}