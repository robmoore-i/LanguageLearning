package main

var (
  Neo4jUser = "neo4j"
	Neo4jPw = "zuhlke"
	Neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:7687"}, "")
)
