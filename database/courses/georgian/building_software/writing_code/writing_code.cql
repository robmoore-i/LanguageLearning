MATCH (building_software:Activity {name: "Building Software"})
CREATE (writing_code:Lesson {name: "Writing Code", activity: "Building Software", course: "Georgian"})<-[:HAS_LESSON {index: 0}]-(building_software)
RETURN writing_code;

MATCH (writing_code:Lesson {name: "Writing Code", activity: "Building Software", course: "Georgian"})
CREATE (tq:Question:TranslationQuestion {given: "Programming", answer: "პროგრამირება"})<-[:HAS_QUESTION {index: 0}]-(writing_code)
RETURN tq;
