// Georgian Course
CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(pcg_hello:TopicLesson {index: 0, name: "Peace Corps Georgia: Hello"})
CREATE (georgian)-[:HAS_TOPIC_LESSON]->(pcg_whatAreYouCalled:TopicLesson {index: 1, name: "Peace Corps Georgia: What are you called?"})
RETURN georgian,pcg_hello,pcg_whatAreYouCalled;

// Georgian Topic Lesson: Hello
MATCH (pcg_hello:TopicLesson {name: "Peace Corps Georgia: Hello"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(teachingLetters:Question:ReadingQuestion {index: 0, course: "Georgian", lesson: "Peace Corps Georgia: Hello", extractFile: "PeaceCorpsGeorgia/georgian-pcg_hello-letters.txt"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterA:Question:MultipleChoiceQuestion {index: 1, question: "sounds like \"a\" in English", a: "მ", b:"ბ", c:"გ", d:"ა", answer: "d"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterM:Question:MultipleChoiceQuestion {index: 2, question: "sounds like \"m\" in English", a: "ა", b:"მ", c:"ო", d:"ჯ", answer: "b"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterO:Question:MultipleChoiceQuestion {index: 3, question: "sounds like \"o\" in English", a: "ო", b:"ჯ", c:"ა", d:"მ", answer: "a"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterG:Question:MultipleChoiceQuestion {index: 4, question: "sounds like \"g\" in English", a: "ჯ", b:"გ", c:"ბ", d:"ო", answer: "b"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterR:Question:MultipleChoiceQuestion {index: 5, question: "sounds like \"r\" in English", a: "გ", b:"ო", c:"რ", d:"ა", answer: "c"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterB:Question:MultipleChoiceQuestion {index: 6, question: "sounds like \"b\" in English", a: "ო", b:"მ", c:"ბ", d:"რ", answer: "c"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(letterJ:Question:MultipleChoiceQuestion {index: 7, question: "sounds like \"j\" in English", a: "ა", b:"ჯ", c:"ბ", d:"გ", answer: "b"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(teachingPhrases:Question:ReadingQuestion {index: 8, course: "Georgian", lesson: "Peace Corps Georgia: Hello", extractFile: "PeaceCorpsGeorgia/georgian-pcg_hello-phrases.txt"})
CREATE (pcg_hello)-[:HAS_QUESTION]->(tqHello:Question:TranslationQuestion {index: 9, given: "Hello", answer: "გამარჯობა"})
RETURN pcg_hello,teachingLetters,letterA,letterM,letterO,letterG,letterR,letterB,letterJ,teachingPhrases,tqHello;

// Georgian Topic Lesson: What are you called?
MATCH (pcg_whatAreYouCalled:TopicLesson {name: "Peace Corps Georgia: What are you called?"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(teachingLetters:Question:ReadingQuestion {index: 0, course: "Georgian", lesson: "Peace Corps Georgia: What are you called?", extractFile: "PeaceCorpsGeorgia/georgian-pcg_whatAreYouCalled-letters.txt"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterI: Question:MultipleChoiceQuestion {index: 1, question: "sounds like \"i\"  in English", a: "ი", b:"გ", c:"ა", d:"ჯ", answer: "a"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterE: Question:MultipleChoiceQuestion {index: 2, question: "sounds like \"e\"  in English", a: "ბ", b:"ი", c:"რ", d:"ე", answer: "d"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterN: Question:MultipleChoiceQuestion {index: 3, question: "sounds like \"n\"  in English", a: "ნ", b:"ო", c:"რ", d:"ე", answer: "a"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterSh:Question:MultipleChoiceQuestion {index: 4, question: "sounds like \"sh\" in English", a: "ე", b:"ნ", c:"შ", d:"ი", answer: "c"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterV: Question:MultipleChoiceQuestion {index: 5, question: "sounds like \"v\"  in English", a: "ი", b:"ვ", c:"ნ", d:"მ", answer: "b"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterT: Question:MultipleChoiceQuestion {index: 6, question: "sounds like \"t\"  in English", a: "ო", b:"შ", c:"თ", d:"ვ", answer: "c"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterS: Question:MultipleChoiceQuestion {index: 7, question: "sounds like \"s\"  in English", a: "ი", b:"თ", c:"შ", d:"ს", answer: "d"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(letterK: Question:MultipleChoiceQuestion {index: 8, question: "sounds like \"k\"  in English", a: "ქ", b:"ნ", c:"ს", d:"ი", answer: "a"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(teachingPhrases:Question:ReadingQuestion {index: 9, course: "Georgian", lesson: "Peace Corps Georgia: What are you called?", extractFile: "PeaceCorpsGeorgia/georgian-pcg_whatAreYouCalled-phrases.txt"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(tqIAmCalled:Question:TranslationQuestion {index: 10, given: "I am called Keti", answers: ["მე მქვია ქეთი", "მე ქეთი მქვია"]})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(tqWhatAreYouCalled:Question:TranslationQuestion {index: 11, given: "What are you called?", answer: "შენ რა გქვია?"})
CREATE (pcg_whatAreYouCalled)-[:HAS_QUESTION]->(tqNiceToMeetYou:Question:TranslationQuestion {index: 12, given: "Nice to meet you!", answer: "სასიამოვნოა!"})
RETURN pcg_whatAreYouCalled,teachingLetters,letterI,letterE,letterN,letterSh,letterV,letterT,letterS,letterK,teachingPhrases,tqIAmCalled,tqWhatAreYouCalled,tqNiceToMeetYou;
