package main

import (
	driver "github.com/johnnadratowski/golang-neo4j-bolt-driver"
	"log"
	"strings"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
	"io/ioutil"
)

var (
	neo4jUser = "neo4j"
	neo4jPw = "zuhlke"
	neo4jURL = strings.Join([]string{"bolt://", neo4jUser, ":", neo4jPw, "@localhost:7687"}, "")

	imagesPath = "/home/rob/Documents/language/melange/database/images/"
)

func performQuery(cypher string, params map[string]interface{}) (driver.Rows, driver.Conn, driver.Stmt) {
	// Open connection
	db, err := driver.NewDriver().OpenNeo(neo4jURL)
	if err != nil {
		log.Printf("Error opening neo4j connection")
		db.Close()
		panic("neo4jdatabase:performQuery")
	}

	// Create statement
	stmt, err := db.PrepareNeo(cypher)
	if err != nil {
		log.Printf("Error preparing cypher query statement")
		stmt.Close()
		panic("neo4jdatabase:performQuery")
	}

	// Perform query
	rows, err := stmt.QueryNeo(params)
	if err != nil {
		log.Printf("Error performing query")
		panic("neo4jdatabase:performQuery")
	}

	return rows, db, stmt
}

func QueryLessonNames() []string {
	cypher := `MATCH (l:Lesson) RETURN l.name`
	rows, db, stmt := performQuery(cypher, nil)
	defer db.Close()
	defer stmt.Close()

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
	cypher := `MATCH (l:Lesson {name: {name}})-[:HAS_QUESTION]->(q) RETURN q`
	params := map[string]interface{}{"name": lessonName}
	rows, db, stmt := performQuery(cypher, params)
	defer db.Close()
	defer stmt.Close()

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

func parseImageType(filename string) string {
	fileExt := filename[len(filename) - 3:] // The last 3 characters
	return fileExt
}

func parseCourse(node graph.Node) Course {
	p := node.Properties
	name := p["name"].(string)
	relPath := p["image"].(string)
	path := strings.Join([]string{imagesPath, relPath}, "")

	imgType := parseImageType(relPath)

	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		log.Printf("Couldn't read course image from path %#v", path)
		panic("neo4jdatabase:parseCourse")
	}

	return Course{Name: name, Image: string(bytes), ImageType: imgType}
}

func QueryCourses() []Course {
	cypher := `MATCH (c:Course) RETURN c`
	rows, db, stmt := performQuery(cypher, nil)
	defer db.Close()
	defer stmt.Close()

	// Extract data
	var courses []Course
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := row[0].(graph.Node)
		parsedCourse := parseCourse(node)
		courses = append(courses, parsedCourse)
		row, _, err = rows.NextNeo()
	}

	return courses
}