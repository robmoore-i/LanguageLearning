package neo4j

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.neo4j.driver.v1.Value

data class Course(val name: String, val fullImagePath: String, val imageFileType: ImageType) {
    private val json = Jackson

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

    companion object {
        fun fromNeo4jValue(neo4jValue: Value, imagesDirectoryPath: String): Course {
            val imageFileRelativePath = neo4jValue["image"].toString().unquoted()
            val imageFileType = ImageType.fromExtension(imageFileRelativePath.fileExtension())
            return Course(
                neo4jValue["name"].toString().unquoted(),
                imagesDirectoryPath + imageFileRelativePath,
                imageFileType
            )
        }
    }
}

class UnknownImageTypeException(msg: String) : Exception(msg)

fun String.fileExtension(): String {
    return this.takeLast(3)
}