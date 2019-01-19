package neo4j

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.neo4j.driver.v1.Value
import java.io.File
import java.util.*

class Neo4jDatabaseAdaptor(
    private val neo4jDriver: Neo4jDriver,
    private val imagesPath: String,
    private val extractsPath: String
) : DatabaseAdaptor {
    override fun allCourses(): List<JsonNode> {
        val records = neo4jDriver.query("MATCH (c:Course) RETURN c")
        return records.map { r -> r[0].parseCourseNode(imagesPath).jsonify() }
    }
}

fun Value.parseCourseNode(imagesDirectoryPath: String): CourseNode {
    val imageFileRelativePath = this["image"].toString().dequote()
    val imageFileType = ImageType.fromExtension(imageFileRelativePath.fileExtension())
    return CourseNode(
        this["name"].toString().dequote(),
        imagesDirectoryPath + imageFileRelativePath,
        imageFileType
    )
}

fun String.fileExtension(): String {
    return this.takeLast(3)
}

fun String.dequote(): String {
    return this.substring(1, this.length - 1)
}

enum class ImageType {
    SVG, PNG, JPG, UNKNOWN;

    override fun toString(): String {
        return when (this) {
            SVG -> "svg"
            PNG -> "png"
            JPG -> "jpg"
            UNKNOWN -> "???"
        }
    }

    companion object {
        fun fromExtension(extension: String): ImageType {
            return when (extension.toLowerCase()) {
                "svg" -> SVG
                "png" -> PNG
                "jpg" -> JPG
                "jpeg" -> JPG
                else -> UNKNOWN
            }
        }
    }
}

data class CourseNode(val name: String, val fullImagePath: String, val imageFileType: ImageType) {
    val json = Jackson

    fun jsonify(): JsonNode {
        val image = parseImage()
        return json {
            obj(
                "name" to string(name),
                "imageType" to string(imageFileType.toString()),
                "image" to string(image)
            )
        }
    }

    private fun parseImage(): String {
        val imageParser = ImageParser()
        return when (imageFileType) {
            ImageType.SVG -> imageParser.parseSvg(fullImagePath)
            ImageType.PNG -> imageParser.parsePng(fullImagePath)
            ImageType.JPG -> imageParser.parseJpg(fullImagePath)
            ImageType.UNKNOWN -> throw UnknownImageTypeException("Couldn't understand image file extension: ${fullImagePath.fileExtension()} - expected one of svg, png, jpg or jpeg")
        }
    }
}

class UnknownImageTypeException(msg: String) : Exception(msg)

class ImageParser {
    fun parseSvg(imagePath: String): String {
        return readImageFileBytes(imagePath).map { byte -> byte.toChar().toString() }.reduce(String::plus)
    }

    fun parsePng(imagePath: String): String {
        val bytes = readImageFileBytes(imagePath)
        return base64Encode(bytes)
    }

    fun parseJpg(imagePath: String): String {
        val bytes = readImageFileBytes(imagePath)
        return base64Encode(bytes)
    }

    private fun base64Encode(bytes: ByteArray): String = Base64.getEncoder().encodeToString(bytes)

    private fun readImageFileBytes(imagePath: String): ByteArray {
        return File(imagePath).readBytes()
    }
}
