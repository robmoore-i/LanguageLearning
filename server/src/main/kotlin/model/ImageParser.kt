package model

import java.io.File
import java.util.*

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