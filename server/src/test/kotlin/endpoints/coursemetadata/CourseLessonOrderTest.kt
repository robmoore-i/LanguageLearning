package endpoints.coursemetadata


import endpoints.EndpointTestCase
import org.junit.Test

class CourseLessonOrderTest : EndpointTestCase() {

    @Test
    fun canGetLessonOrderForACourse() {
        testDatabaseAdaptor.runQuery("""
                CREATE (c:Course {name: "Course", image: "flagGeorgia.svg"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
                CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
                RETURN hello,whatAreYouCalled,colours,c;
                """)

        val responseJson = courseMetadataRequestJson("Course")
        val lessonMetadata = responseJson["lessonMetadata"]

        assertLessonHasIndex(lessonMetadata, "Hello", 0)
        assertLessonHasIndex(lessonMetadata, "What are you called?", 1)
        assertLessonHasIndex(lessonMetadata, "Colours", 2)
    }
}