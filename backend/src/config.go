package main

import (
    "strings"
)

var (
    neo4jUser = "neo4j"
    neo4jPw = "zuhlke"
    Neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:7687"}, "")
    ImagesPath = "/home/rob/Documents/language/melange/database/images/"
)
