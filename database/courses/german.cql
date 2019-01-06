CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 0}]->(clothes:TopicLesson {name: "Clothes"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 1}]->(colours:TopicLesson {name: "Colours"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 2}]->(meat:TopicLesson {name: "Food", course: "German"})
RETURN german,clothes,colours,meat;

MATCH (clothes:TopicLesson {name: "Clothes"})
CREATE (clothes)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "Das Hemd", answers: ["Shirt", "The shirt"]})
RETURN clothes,tq;

MATCH (colours:TopicLesson {name: "Colours"})
CREATE (colours)-[:HAS_QUESTION {index: 0}]->(rq:Question:ReadingQuestion {extractInline: "Der Zug ist blau und das Auto ist rot. Der Rasen ist grün."})
CREATE (rq)-[:HAS_SUBQUESTION {index: 0}]->(rsq1:ReadingSubQuestion {given:"What colour is the train?", answer:"blue"})
CREATE (rq)-[:HAS_SUBQUESTION {index: 1}]->(rsq2:ReadingSubQuestion {given: "What colour is the car?", answer: "red"})
CREATE (rq)-[:HAS_SUBQUESTION {index: 2}]->(rsq3:ReadingSubQuestion {given:"What is said to be green?", answers:["Grass", "The grass"]})
RETURN colours,rq,rsq1,rsq2,rsq3;

MATCH (meat:TopicLesson {name: "Food", course: "German"})
CREATE (meat)-[:HAS_QUESTION {index: 0}]->(teaching:Question:ReadingQuestion {extractInline: "\"Das Fleisch\" means \"meat\" in English "})
CREATE (meat)-[:HAS_QUESTION {index: 1}]->(whatIsMeat: Question:MultipleChoiceQuestion {question: "means \"meat\" in English", a: "Die Wurst", b: "Das Fleisch", c: "Das Hähnchen", answer: "b"})
RETURN meat,teaching,whatIsMeat;
