package neo4j

import com.fasterxml.jackson.databind.JsonNode
import org.http4k.format.Jackson
import org.neo4j.driver.v1.Value

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

    companion object {
        fun fromNode(node: Value, imagesDirectoryPath: String): CourseNode {
            val imageFileRelativePath = node["image"].toString().dequote()
            val imageFileType = ImageType.fromExtension(imageFileRelativePath.fileExtension())
            return CourseNode(
                node["name"].toString().dequote(),
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

fun String.dequote(): String {
    return this.substring(1, this.length - 1)
}