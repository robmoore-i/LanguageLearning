// German Course
CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
CREATE (german)-[:HAS_TOPIC_LESSON]->(clothes:TopicLesson {index: 0, name: "Clothes"})
RETURN german,clothes;

// German Topic Lesson: Clothes
MATCH (clothes:TopicLesson {name: "Clothes"})
CREATE (clothes)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {index: 0, given: "Das Hemd", answers: ["Shirt", "The shirt"]})
RETURN clothes,tq;
