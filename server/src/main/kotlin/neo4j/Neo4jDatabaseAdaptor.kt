package neo4j

class Neo4jDatabaseAdaptor(
    private val neo4jDriver: Neo4jDriver,
    private val imagesPath: String,
    private val extractsPath: String
) : DatabaseAdaptor {
    override fun allCourses(): Any {
        val records = neo4jDriver.query("MATCH (c:Course) RETURN c")
        val nodes = records.map { r -> r[0] }
        val courseNodes = nodes.map { node ->
            val imageFile = node["image"].toString().dequote()
            val imageFileType = ImageType.fromExtension(imageFile.takeLast(3))
            CourseNode(
                node["name"].toString().dequote(),
                imagesPath + imageFile,
                imageFileType
            )
        }

        courseNodes.map({ courseNode -> courseNode.jsonify() })

        // Return JSON
        // eg
        // [{name: X, image: Y, imageType: Z}]

        return 0
    }
}

fun String.dequote(): String {
    return this.substring(1, this.length - 1)
}

enum class ImageType {
    SVG, PNG, JPG, UNKNOWN;

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
    fun jsonify(): Any {
        print(this)
        return 0
    }

}
