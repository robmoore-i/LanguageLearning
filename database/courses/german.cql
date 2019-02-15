CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 0}]->(clothes:TopicLesson {name: "Clothes"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 1}]->(colours:TopicLesson {name: "Colours"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 2}]->(meat:TopicLesson {name: "Food", course: "German"})
CREATE (german)-[:HAS_TOPIC_LESSON {index: 3}]->(sounds:TopicLesson {name: "Sounds", course: "German"})
RETURN german,clothes,colours,meat,sounds;

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

MATCH (sounds:TopicLesson {name: "Sounds", course: "German"})
CREATE (sounds)-[:HAS_QUESTION {index: 0}]->(teaching:Question:ReadingQuestion {extractInline: "The funny 'b' sounds like s. 'a' with two dots over it and surrounded by consanants sounds like 'e'."})
CREATE (sounds)-[:HAS_QUESTION {index: 1}]->(funnyB: Question:MultipleChoiceQuestion {question: "does \"ß\" sound like in \"Fußball\"", a: "S", b: "B", c: "C", d: "F", answer: "a"})
CREATE (sounds)-[:HAS_QUESTION {index: 2}]->(aUmlaut: Question:MultipleChoiceQuestion {question: "does \"ä\" sound like in \"Männer\"", a: "short e", b: "long e", c: "short i ", d: "long i", answer: "a"})
CREATE (sounds)-[:HAS_QUESTION {index: 3}]->(closing:Question:ReadingQuestion {extractInline: "In this lesson you learnt about funny letters in German."})
RETURN sounds,teaching,funnyB,aUmlaut,closing;
