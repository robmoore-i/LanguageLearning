// Georgian Course
CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(hello:TopicLesson {index: 0, name: "Hello"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(whatAreYouCalled:TopicLesson {index: 1, name: "What are you called?"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(colours:TopicLesson {index: 2, name: "Colours"})
RETURN georgian,hello,whatAreYouCalled,colours;

// Georgian Topic Lesson: Hello
MATCH (hello:TopicLesson {name: "Hello"})
CREATE (hello)-[:HAS_QUESTION]->(teaching:Question:ReadingQuestion {index: 0, course: "georgian", lesson: "hello", extractFile: "welcome.txt"})
CREATE (teaching)-[:HAS_SUBQUESTION]->(georgiaInGeorgian:ReadingSubQuestion {index: 0, given:"What does 'საქართველო' mean in English?", answer:"Georgia"})
CREATE (hello)-[:HAS_QUESTION]->(letterA:Question:MultipleChoiceQuestion {index: 1, question: "sounds like \"a\" in English", a: "მ",b:"ბ", c:"გ", d:"ა", answer: "d"})
CREATE (hello)-[:HAS_QUESTION]->(letterM:Question:MultipleChoiceQuestion {index: 2, question: "sounds like \"m\" in English", a: "ა",b:"მ", c:"ო", d:"ჯ", answer: "b"})
CREATE (hello)-[:HAS_QUESTION]->(letterO:Question:MultipleChoiceQuestion {index: 3, question: "sounds like \"o\" in English", a: "ო",b:"ჯ", c:"ა", d:"მ", answer: "a"})
CREATE (hello)-[:HAS_QUESTION]->(letterG:Question:MultipleChoiceQuestion {index: 4, question: "sounds like \"g\" in English", a: "ჯ",b:"გ", c:"ბ", d:"ო", answer: "b"})
CREATE (hello)-[:HAS_QUESTION]->(letterR:Question:MultipleChoiceQuestion {index: 5, question: "sounds like \"r\" in English", a: "გ",b:"ო", c:"რ", d:"ა", answer: "c"})
CREATE (hello)-[:HAS_QUESTION]->(letterB:Question:MultipleChoiceQuestion {index: 6, question: "sounds like \"b\" in English", a: "ო",b:"მ", c:"ბ", d:"რ", answer: "c"})
CREATE (hello)-[:HAS_QUESTION]->(letterJ:Question:MultipleChoiceQuestion {index: 7, question: "sounds like \"j\" in English", a: "ა",b:"ჯ", c:"ბ", d:"გ", answer: "b"})
CREATE (hello)-[:HAS_QUESTION]->(helloTranslation:Question:TranslationQuestion {index: 8, given: "Hello", answer: "გამარჯობა"})
RETURN hello,teaching,georgiaInGeorgian,letterA,letterM,letterO,letterG,letterR,letterB,letterJ,helloTranslation;

// Georgian Topic Lesson: What are you called?
MATCH (whatAreYouCalled:TopicLesson {name: "What are you called?"})
CREATE (whatAreYouCalled)-[:HAS_QUESTION]->(mcq:Question:MultipleChoiceQuestion {index: 0, question: "sounds like \"s\" in English", a: "წ",b:"ა", c:"ს", d:"დ", answer: "c"})
CREATE (whatAreYouCalled)-[:HAS_QUESTION]->(tq:Question:TranslationQuestion {index: 1, given: "What are you called?", answer: "შენ რა გქვია?"})
RETURN whatAreYouCalled,mcq,tq;

// Georgian Topic Lesson: Colours
MATCH (colours:TopicLesson {name: "Colours"})
CREATE (colours)-[:HAS_QUESTION]->(rq:Question:ReadingQuestion {index: 2, course: "georgian", lesson: "colours", extractInline: "მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა."})
CREATE (rq)-[:HAS_SUBQUESTION]->(rsq1:ReadingSubQuestion {index: 0, given:"What colour is the train?", answer:"blue"})
CREATE (rq)-[:HAS_SUBQUESTION]->(rsq2:ReadingSubQuestion {index: 1, given: "What colour is the car?", answer: "red"})
CREATE (rq)-[:HAS_SUBQUESTION]->(rsq3:ReadingSubQuestion {index: 2, given:"What is said to be green?", answers:["Grass", "The grass"]})
RETURN colours,rq,rsq1,rsq2,rsq3;
