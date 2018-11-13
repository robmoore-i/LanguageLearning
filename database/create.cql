// Creates the current database

// Delete existing data
MATCH (n) DETACH DELETE n;
MATCH (n) DELETE (n);

// Georgian Course
CREATE (hello:Lesson {name: "Hello"})<-[:HAS_LESSON]-(georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})-[:HAS_LESSON]->(whatAreYouCalled:Lesson {name: "What are you called?"})
RETURN georgian,hello,whatAreYouCalled;

// Georgian Lesson: Hello
MATCH (hello:Lesson {name: "Hello"})
CREATE (tq:Question:TranslationQuestion {given: "Hello", answer: "გამარჯობა"})<-[:HAS_QUESTION]-(hello)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"i\" in English", a: "ა",b:"ო", c:"უ", d:"ი", answer: "d"})
RETURN hello,tq,mcq;

// Georgian Lesson: What are you called?
MATCH (whatAreYouCalled:Lesson {name: "What are you called?"})
CREATE (tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})<-[:HAS_QUESTION]-(whatAreYouCalled)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"})
RETURN whatAreYouCalled,tq,mcq;

// Georgian Lesson: Colours
MATCH (georgian: Course) WHERE georgian.name = "Georgian"
CREATE (rq:Question:ReadingQuestion {`extract`: "მატარებელი ლურჯია და მანქანა წითელი არის"})<-[:HAS_QUESTION]-(trains:Lesson {name: "Colours"})<-[:HAS_LESSON]-(georgian)
CREATE (rsq1:ReadingSubQuestion {given:"What colour is the train?", answer:"blue"})<-[:HAS_SUBQUESTION]-(rq)-[:HAS_SUBQUESTION]->(rsq2:ReadingSubQuestion {given: "What colour is the car?", answer: "red"})
RETURN georgian,trains,rq,rsq1,rsq2;

// French Course
CREATE (french:Course {name: "French", image: "flagFrance.png"})-[:HAS_LESSON]->(animals:Lesson {name: "Animals"})
RETURN french,animals;

// French Lesson: Animals
MATCH (animals:Lesson {name: "Animals"})
CREATE (animals)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {given: "Mouse", answer: "La Souris"})
RETURN animals,tq;

// German Course
CREATE (german:Course {name: "German", image: "flagGermany.jpg"})-[:HAS_LESSON]->(clothes:Lesson {name: "Clothes"})
RETURN german,clothes;

// German Lesson: Clothes
MATCH (clothes:Lesson {name: "Clothes"})
CREATE (clothes)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {given: "Shirt", answer: "Das Hemd"})
RETURN clothes,tq;
