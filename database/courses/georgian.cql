// Georgian Course
CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(hello:TopicLesson {index: 0, name: "Hello"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(whatAreYouCalled:TopicLesson {index: 1, name: "What are you called?"})
RETURN georgian,hello,whatAreYouCalled;

// Georgian Topic Lesson: Hello
MATCH (hello:TopicLesson {name: "Hello"})
CREATE (hello)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {index: 0, question: "sounds like \"i\" in English", a: "ა",b:"ო", c:"უ", d:"ი", answer: "d"})
CREATE (hello)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {index: 1, given: "Hello", answer: "გამარჯობა"})
RETURN hello,mcq,tq;

// Georgian Topic Lesson: What are you called?
MATCH (whatAreYouCalled:TopicLesson {name: "What are you called?"})
CREATE (whatAreYouCalled)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {index: 0, question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"})
CREATE (whatAreYouCalled)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {index: 1, given: "What are you called?", answer: "შენ რა გქვია?"})
RETURN whatAreYouCalled,mcq,tq;

// Georgian Topic Lesson: Colours
MATCH (georgian:Course {name: "Georgian"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(colours:TopicLesson {index: 2, name: "Colours"})
CREATE (colours)-[:HAS_QUESTION]->(rq:Question:ReadingQuestion {index: 2, `extract`: "მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა."})
CREATE (rq)-[:HAS_SUBQUESTION]->(rsq1:ReadingSubQuestion {index: 0, given:"What colour is the train?", answer:"blue"})
CREATE (rq)-[:HAS_SUBQUESTION]->(rsq2:ReadingSubQuestion {index: 1, given: "What colour is the car?", answer: "red"})
CREATE (rq)-[:HAS_SUBQUESTION]->(rsq3:ReadingSubQuestion {index: 2, given:"What is said to be green?", answers:["Grass", "The grass"]})
RETURN georgian,colours,rq,rsq1,rsq2,rsq3;
