// French Course
CREATE (french:Course {name: "French", image: "flagFrance.png"})
CREATE (french)-[:HAS_TOPIC_LESSON]->(animals:TopicLesson {index: 0, name: "Animals"})
RETURN french,animals;

// French Topic Lesson: Animals
MATCH (animals:TopicLesson {name: "Animals"})
CREATE (animals)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {index: 0, given: "Mouse", answer: "La Souris"})
RETURN animals,tq;
