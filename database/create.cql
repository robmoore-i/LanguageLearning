// Creates the current database

// Delete existing data
MATCH (n) DETACH DELETE n;
MATCH (n) DELETE (n);

// Lesson: Hello
CREATE p = (tq:Question:TranslationQuestion {given: "Hello", answer: "გამარჯობა"})<-[:HAS_QUESTION]-(l:Lesson {name: "Hello"})-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"i\" in English", a: "ა",b:"ო", c:"უ", d:"ი", answer: "d"}) RETURN l,tq,mcq;

// Lesson: What are you called
CREATE p = (tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})<-[:HAS_QUESTION]-(l:Lesson {name: "What are you called?"})-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"}) RETURN l,tq,mcq;
