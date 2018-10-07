\l jsonrestapi.q

.get.serve["/lessonnames";
    .res.ok {[req]
        ("hello";"what are you called?")}]

.get.serve["/lesson/:lessonName";
    .res.ok {[req]
        (enlist `name)!enlist req[`params;`lessonName]}]

.jra.listen 8000