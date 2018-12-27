// French Course
CREATE (french:Course {name: "French", image: "flagFrance.png"})
CREATE (french)-[:HAS_TOPIC_LESSON {index: 0}]->(animals:TopicLesson {name: "Animals"})
CREATE (french)-[:HAS_TOPIC_LESSON {index: 1}]->(food:TopicLesson {name: "Food"})
RETURN french,animals,food;

// French Topic Lesson: Animals
MATCH (animals:TopicLesson {name: "Animals"})
CREATE (animals)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "Mouse", answer: "La Souris"})
RETURN animals,tq;

// French Topic Lesson: Food
MATCH (food:TopicLesson {name: "Food"})
CREATE (food)-[:HAS_QUESTION {index: 0}]->(mcq:Question:MultipleChoiceQuestion {question: "means 'cheese' in French?", a: "Le pain", b:"La pomme", c:"Le fromage", d:"La carotte", answer: "c"})
RETURN food,mcq;
