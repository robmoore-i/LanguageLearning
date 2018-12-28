package main

import (
    "strings"
    "os"
)

var (
    neo4jUser = os.Getenv("APP_NEO4J_USER")
    neo4jPw = os.Getenv("APP_NEO4J_PW")
    neo4jPortStr = os.Getenv("APP_NEO4J_PORT")
    Neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:" + neo4jPortStr }, "")
    ImagesPath = os.Getenv("APP_IMAGES_PATH")
    ExtractsPath = os.Getenv("APP_EXTRACTS_PATH")
    ServerPortStr = os.Getenv("APP_SERVER_PORT")
    FrontendPortStr = os.Getenv("APP_FRONTEND_PORT")
)
