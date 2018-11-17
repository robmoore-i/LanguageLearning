package main

import (
    "strings"
    "os"
)

var (
    neo4jUser = os.Getenv("MELANGE_NEO4J_USER")
    neo4jPw = os.Getenv("MELANGE_NEO4J_PW")
    neo4jPortStr = os.Getenv("MELANGE_NEO4J_PORT")
    Neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:" + neo4jPortStr }, "")
    ImagesPath = os.Getenv("MELANGE_IMAGES_PATH")
    ServerPortStr = os.Getenv("MELANGE_SERVER_PORT")
    FrontendPortStr = os.Getenv("MELANGE_FRONTEND_PORT")
)
