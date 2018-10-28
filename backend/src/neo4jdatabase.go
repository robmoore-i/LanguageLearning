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

// ====== Courses =========

func QueryCourses() []Course {
	cypher := `MATCH (c:Course) RETURN c`
	rows, conn, stmt := performQuery(cypher, nil)
	defer conn.Close()
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

func parseImageType(filename string) string {
	fileExt := filename[len(filename) - 3:] // The last 3 characters
	return fileExt
}

// ====== LessonNames =========

func QueryLessonNames() []string {
	cypher := `MATCH (l:Lesson) RETURN l.name`
	rows, conn, stmt := performQuery(cypher, nil)
	defer conn.Close()
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

// ====== Lesson =========

func QueryLesson(lessonName string) Lesson {
	cypher := `MATCH (l:Lesson {name: {name}})-[:HAS_QUESTION]->(q) RETURN q`
	params := map[string]interface{}{"name": lessonName}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
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

func parseQuestion(node graph.Node) JsonEncodable {
	if hasLabel(node, "TranslationQuestion") {
		return parseTQ(node)
	} else if hasLabel(node, "MultipleChoiceQuestion") {
		return parseMCQ(node)
	} else if hasLabel(node, "ReadingQuestion") {
		return parseRQ(node)
	} else {
		log.Printf("Couldn't find any appropriate question type label on node %#v", node)
		panic("neo4jdatabase:parseQuestion")
	}
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

func parseRQ(node graph.Node) JsonEncodable {
	p := node.Properties
	extract := p["extract"].(string)

	//cypher := "MATCH (rq:ReadingQuestion {extract: {extract})-[:HAS_SUBQUESTION]->(q:ReadingSubQuestion) RETURN q"
	cypher := "MATCH (rsq:ReadingSubQuestion) RETURN rsq"
	params := map[string]interface{}{"extract": extract}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

	var questions []ReadingSubQuestion
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := row[0].(graph.Node)
		parsedSubQuestion := parseRSQ(node)
		questions = append(questions, parsedSubQuestion)
		row, _, err = rows.NextNeo()
	}

	return NewRQ(extract, questions)
}

func parseRSQ(node graph.Node) ReadingSubQuestion {
	p := node.Properties
	return NewRSQ(p["given"].(string), p["answer"].(string))
}

// ====== Common =========

func openConnection() driver.Conn {
	conn, err := driver.NewDriver().OpenNeo(neo4jURL)
	if err != nil {
		log.Printf("Error opening neo4j connection")
		conn.Close()
		panic("neo4jdatabase:openConnection")
	}
	return conn
}

func prepareStatement(conn driver.Conn, cypher string) driver.Stmt {
	stmt, err := conn.PrepareNeo(cypher)
	if err != nil {
		log.Printf("Error preparing cypher query statement")
		panic("neo4jdatabase:prepareStatement")
	}
	return stmt
}

func executeStatement(stmt driver.Stmt, params map[string]interface{}) driver.Rows {
	rows, err := stmt.QueryNeo(params)
	if err != nil {
		log.Printf("Error performing query")
		panic("neo4jdatabase:executeStatement")
	}
	return rows
}

func performQuery(cypher string, params map[string]interface{}) (driver.Rows, driver.Conn, driver.Stmt) {
	conn := openConnection()
	stmt := prepareStatement(conn, cypher)
	rows := executeStatement(stmt, params)
	return rows, conn, stmt
}