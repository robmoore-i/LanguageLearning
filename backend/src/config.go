package main

import (
    "strings"
    "strconv"
)

var (
    neo4jUser = "neo4j"
    neo4jPw = "zuhlke"
    neo4jPort = 7687
    Neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:" + strconv.Itoa(neo4jPort) }, "")
    ImagesPath = "/home/rob/Documents/language/melange/database/images/"
    ServerPort = 8000
)
