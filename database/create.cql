// Creates the current database

// Delete existing data
MATCH (n) DETACH DELETE n;
MATCH (n) DELETE (n);

// Georgian Course
CREATE (hello:Lesson {name: "Hello"})<-[:HAS_LESSON]-(georgian:Course {name: "Georgian"})-[:HAS_LESSON]->(whatAreYouCalled:Lesson {name: "What are you called?"})
RETURN georgian,hello,whatAreYouCalled;

// Georgian Lesson: Hello
MATCH (hello:Lesson {name: "Hello"})
CREATE (tq:Question:TranslationQuestion {given: "Hello", answer: "გამარჯობა"})<-[:HAS_QUESTION]-(hello)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"i\" in English", a: "ა",b:"ო", c:"უ", d:"ი", answer: "d"})
RETURN hello,tq,mcq;

// Georgian Lesson: What are you called
MATCH (whatAreYouCalled:Lesson {name: "What are you called?"})
CREATE (tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})<-[:HAS_QUESTION]-(whatAreYouCalled)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"})
RETURN whatAreYouCalled,tq,mcq;
