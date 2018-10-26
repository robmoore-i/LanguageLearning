// Creates the current database

// Delete existing data
MATCH (n) DETACH DELETE n;
MATCH (n) DELETE (n);

// Lesson: Hello
CREATE (mcq:Question:MultipleChoiceQuestion {question: "sounds like \"i\" in English", a: "ა",b:"ო", c:"უ", d:"ი", answer: "d"});
CREATE (tq:Question:TranslationQuestion {given: "Hello", answer: "გამარჯობა"});
CREATE (l:Lesson {name: "hello"});
MATCH (q:Question),(l:Lesson) CREATE (l)-[r:HAS_QUESTION]->(q);

// Lesson: What are you called
CREATE (mcq:Question:MultipleChoiceQuestion {question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"});
CREATE (tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"});
CREATE (l:Lesson {name: "what are you called?"});
MATCH (tq:TranslationQuestion),(l:Lesson) WHERE tq.given = "What are you called?" AND l.name = "what are you called?" CREATE (l)-[r:HAS_QUESTION]->(tq);
MATCH (mcq:MultipleChoiceQuestion),(l:Lesson) WHERE mcq.answer = "c" AND l.name = "what are you called?" CREATE (l)-[r:HAS_QUESTION]->(mcq);