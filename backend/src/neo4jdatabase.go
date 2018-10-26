package main

import (
	driver "github.com/johnnadratowski/golang-neo4j-bolt-driver"
	"log"
	"strings"
)

var (
	neo4jUser = "neo4j"
	neo4jPw = "zuhlke"
	neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:7687"}, "")
)

func QueryLessonNames() []string {
	// Open connection
	db, err := driver.NewDriver().OpenNeo(neo4jURL)
	if err != nil {
		log.Printf("Error opening neo4j connection")
		return []string{}
	}
	defer db.Close()

	// Create statement
	cypher := `MATCH (n:Lesson) RETURN n.name`
	stmt, err := db.PrepareNeo(cypher)
	if err != nil {
		log.Printf("Error preparing cypher query statement")
		return []string{}
	}
	defer stmt.Close()

	// Perform query
	rows, err := stmt.QueryNeo(nil)
	if err != nil {
		log.Printf("Error performing query")
		return []string{}
	}

	// Extract data
	var lessonNames []string
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		lessonNames = append(lessonNames, row[0].(string))
		row, _, err = rows.NextNeo()
	}
	return lessonNames
}
