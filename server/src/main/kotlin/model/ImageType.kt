package model

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