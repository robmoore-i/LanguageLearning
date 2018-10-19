\l jsonrestapi.q

.get.serve["/lessonnames";
    .res.ok {[req]
        ("hello";"what are you called?")}]

// Translation Question
tq:{[given;answer]`type`given`answer!(0;given;answer)}
helloTQ:tq["hello";"გამარჯობა"]

// Multiple Choice Question
mcq:{[question;a;b;c;d;answer]`type`question`a`b`c`d`answer!(1;question;a;b;c;d;answer)}
letterSoundsLikeiMCQ:mcq["sounds like \"i\" in English";"ა";"ო";"უ";"ი";"d"]

// Lesson
helloLesson:`name`questions!("hello";(letterSoundsLikeiMCQ;helloTQ))

.get.serve["/lesson/:lessonName";
    .res.ok {[req]
        helloLesson}]

.jra.listen 8000