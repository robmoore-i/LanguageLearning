package main

import (
	driver "github.com/johnnadratowski/golang-neo4j-bolt-driver"
	"log"
	"strings"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
)

var (
	neo4jUser = "neo4j"
	neo4jPw = "zuhlke"
	neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:7687"}, "")
)

//func performQuery(cypher string, params map[string]interface{}) driver.Rows {
//
//}

func QueryLessonNames() []string {
	// Open connection
	db, err := driver.NewDriver().OpenNeo(neo4jURL)
	if err != nil {
		log.Printf("Error opening neo4j connection")
		panic("neo4jdatabase:QueryLesson")
	}
	defer db.Close()

	// Create statement
	cypher := `MATCH (n:Lesson) RETURN n.name`
	stmt, err := db.PrepareNeo(cypher)
	if err != nil {
		log.Printf("Error preparing cypher query statement")
		panic("neo4jdatabase:QueryLesson")
	}
	defer stmt.Close()

	// Perform query
	rows, err := stmt.QueryNeo(nil)
	if err != nil {
		log.Printf("Error performing query")
		panic("neo4jdatabase:QueryLesson")
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

func hasLabel(node graph.Node, keyLabel string) bool {
	for _, label := range node.Labels {
		if label == keyLabel {
			return true
		}
	}
	return false
}

func parseTQ(node graph.Node) JsonEncodable {
	p := node.Properties
	return NewTQ(p["given"].(string), p["answer"].(string))
}

func parseMCQ(node graph.Node) JsonEncodable {
	p := node.Properties
	return NewMCQ(p["question"].(string), p["a"].(string), p["b"].(string), p["c"].(string), p["d"].(string), p["answer"].(string))
}

func parseQuestion(node graph.Node) JsonEncodable {
	if hasLabel(node, "TranslationQuestion") {
		return parseTQ(node)
	} else if hasLabel(node, "MultipleChoiceQuestion") {
		return parseMCQ(node)
	} else {
		log.Printf("Couldn't find any appropriate question type label on node %#v", node)
		panic("neo4jdatabase:parseQuestion")
	}
}

func QueryLesson(lessonName string) Lesson {
	// Open connection
	db, err := driver.NewDriver().OpenNeo(neo4jURL)
	if err != nil {
		log.Printf("Error opening neo4j connection")
		panic("neo4jdatabase:QueryLesson")
	}
	defer db.Close()

	// Create statement
	cypher := `MATCH (n:Lesson {name: {name}})-[:HAS_QUESTION]->(q) RETURN q`
	stmt, err := db.PrepareNeo(cypher)
	if err != nil {
		log.Printf("Error preparing cypher query statement")
		panic("neo4jdatabase:QueryLesson")
	}
	defer stmt.Close()

	// Perform query
	rows, err := stmt.QueryNeo(map[string]interface{}{"name": lessonName})
	if err != nil {
		log.Printf("Error performing query")
		panic("neo4jdatabase:QueryLesson")
	}

	// Extract data
	var questions []JsonEncodable
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := row[0].(graph.Node)
		parsedQuestion := parseQuestion(node)
		questions = append(questions, parsedQuestion)
		row, _, err = rows.NextNeo()
	}

	return Lesson{Name: lessonName, Questions: questions}
}