\l jsonrestapi.q

.get.serve["/lessonnames";
    .res.ok {[req]
        ("hello";"what are you called?")}]

.jra.listen 8000