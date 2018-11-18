// Creates the current database

// Delete existing data
MATCH (n) DETACH DELETE n;
MATCH (n) DELETE (n);

// Georgian Course
CREATE (hello:TopicLesson {name: "Hello"})<-[:HAS_TOPIC_LESSON]-(georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})-[:HAS_TOPIC_LESSON]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
RETURN georgian,hello,whatAreYouCalled;

// Georgian Topic Lesson: Hello
MATCH (hello:TopicLesson {name: "Hello"})
CREATE (tq:Question:TranslationQuestion {given: "Hello", answer: "გამარჯობა"})<-[:HAS_QUESTION]-(hello)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"i\" in English", a: "ა",b:"ო", c:"უ", d:"ი", answer: "d"})
RETURN hello,tq,mcq;

// Georgian Topic Lesson: What are you called?
MATCH (whatAreYouCalled:TopicLesson {name: "What are you called?"})
CREATE (tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})<-[:HAS_QUESTION]-(whatAreYouCalled)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"})
RETURN whatAreYouCalled,tq,mcq;

// Georgian Topic Lesson: Colours
MATCH (georgian: Course) WHERE georgian.name = "Georgian"
CREATE (rq:Question:ReadingQuestion {`extract`: "მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა."})<-[:HAS_QUESTION]-(colours:TopicLesson {name: "Colours"})<-[:HAS_TOPIC_LESSON]-(georgian)
CREATE (rsq1:ReadingSubQuestion {given:"What colour is the train?", answer:"blue"})<-[:HAS_SUBQUESTION]-(rq)-[:HAS_SUBQUESTION]->(rsq2:ReadingSubQuestion {given: "What colour is the car?", answer: "red"})
CREATE (rsq3:ReadingSubQuestion {given:"What is said to be green?", answers:["Grass", "The grass"]})<-[:HAS_SUBQUESTION]-(rq)
RETURN georgian,colours,rq,rsq1,rsq2,rsq3;

// French Course
CREATE (french:Course {name: "French", image: "flagFrance.png"})-[:HAS_TOPIC_LESSON]->(animals:TopicLesson {name: "Animals"})
RETURN french,animals;

// French Topic Lesson: Animals
MATCH (animals:TopicLesson {name: "Animals"})
CREATE (animals)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {given: "Mouse", answer: "La Souris"})
RETURN animals,tq;

// German Course
CREATE (german:Course {name: "German", image: "flagGermany.jpg"})-[:HAS_TOPIC_LESSON]->(clothes:TopicLesson {name: "Clothes"})
RETURN german,clothes;

// German Topic Lesson: Clothes
MATCH (clothes:TopicLesson {name: "Clothes"})
CREATE (clothes)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {given: "Das Hemd", answers: ["Shirt", "The shirt"]})
RETURN clothes,tq;
