package endpoints

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.core.Response

interface TestRequester {
    fun courseMetadataRequestJson(courseName: String): JsonNode
    fun courseMetadataRequest(courseName: String): Response

}
