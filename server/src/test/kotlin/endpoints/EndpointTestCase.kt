package endpoints


import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.http4k.client.JavaHttpClient
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.junit.After
import org.junit.Before
import server.Server

open class EndpointTestCase {
    val environmentLoader = EnvironmentLoader(System::getenv)
    val environment = environmentLoader.getEnvironment()
    val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)
    val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
        neo4jDriver,
        environment.imagesPath,
        environment.extractsPath
    )

    val logger = ServerLogger()

    val server: Http4kServer = Server(
        environment.serverPort,
        neo4jDatabaseAdaptor,
        environment.frontendPort,
        logger
    )

    val client = JavaHttpClient()
    val serverUrl = "http://localhost:${environment.serverPort}"

    val json = Jackson

    @After
    fun tearDown() {
        server.stop()
        neo4jDriver.session().let { session ->
            session.run("MATCH (n) DETACH DELETE (n)")
            session.run("MATCH (n) DELETE (n)")
            session.close()
        }
    }

    @Before
    fun setUp() {
        server.start()
    }
}