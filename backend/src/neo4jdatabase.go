package main

import (
	driver "github.com/johnnadratowski/golang-neo4j-bolt-driver"
	"log"
	"strings"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
	"io/ioutil"
    b64 "encoding/base64"
)

// ====== Courses =========

func QueryCourses() []Course {
	cypher := `MATCH (c:Course) RETURN c`
	rows, conn, stmt := performQuery(cypher, nil)
	defer conn.Close()
	defer stmt.Close()

	var courses []Course
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := onlyNode(row)
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
	path := strings.Join([]string{ImagesPath, relPath}, "")

	imgType := parseImageType(relPath)

	bytes, err := ioutil.ReadFile(path)

	if err != nil {
		log.Printf("Couldn't read course image from path %#v", path)
		panic("neo4jdatabase:parseCourse")
	}

    if imgType == "svg" {
        return Course{Name: name, Image: string(bytes), ImageType: imgType}
    } else if imgType == "png" {
        encoded := b64.StdEncoding.EncodeToString(bytes)
        return Course{Name: name, Image: encoded, ImageType: imgType}
    } else if imgType == "jpg" {
        encoded := b64.StdEncoding.EncodeToString(bytes)
        return Course{Name: name, Image: encoded, ImageType: imgType}
    } else {
        panic("Image is none of [svg | png | jpg]")
    }
}

// Returns a 3 letter file extension for the image type. svg, png or jpg.
func parseImageType(filename string) string {
    if filename[len(filename) - 4:] == "jpeg" {
        return "jpg"
    } else {
        return filename[len(filename) - 3:]
    }
}

// ====== LessonNames =========

func QueryLessonNames(course string) CourseLessonNames {
	cypher := `MATCH (tl:TopicLesson)<-[:HAS_TOPIC_LESSON]-(c:Course {name: {course}}) RETURN tl.name`
    params := map[string]interface{}{"course": course}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

	var topicLessonNames []string
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		topicLessonNames = append(topicLessonNames, row[0].(string))
		row, _, err = rows.NextNeo()
	}

    courseLessonNames := NewCourseLessonNames(topicLessonNames)

	return courseLessonNames
}

// ====== Lesson =========

func QueryLesson(lessonName string) Lesson {
	cypher := `MATCH (tl:TopicLesson {name: {name}})-[:HAS_QUESTION]->(q) RETURN q`
	params := map[string]interface{}{"name": lessonName}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

	var questions []JsonEncodable
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := onlyNode(row)
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

func toStrings(list []interface{}) []string {
    var result []string
    for _, elem := range list {
        result = append(result, elem.(string))
    }
    return result
}

func parseTQ(node graph.Node) JsonEncodable {
	p := node.Properties
    if answer, isSATQ := p["answer"]; isSATQ {
        return NewSATQ(p["given"].(string), answer.(string))
    } else if answers, isMATQ := p["answers"]; isMATQ {
        return NewMATQ(p["given"].(string), toStrings(answers.([]interface{})))
    } else {
        log.Printf("TQ node had neither answer nor answers property")
        panic("neo4jdatabase:parseTQ")
    }
}

func parseMCQ(node graph.Node) JsonEncodable {
	p := node.Properties
	return NewMCQ(p["question"].(string), p["a"].(string), p["b"].(string), p["c"].(string), p["d"].(string), p["answer"].(string))
}

func parseRQ(node graph.Node) JsonEncodable {
	p := node.Properties
	extract := p["extract"].(string)

	cypher := "MATCH (rq:ReadingQuestion {`extract`: {extract}})-[:HAS_SUBQUESTION]->(q:ReadingSubQuestion) RETURN q"
	params := map[string]interface{}{"extract": extract}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

	var subquestions []JsonEncodable
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := onlyNode(row)
		parsedSubQuestion := parseRSQ(node)
		subquestions = append(subquestions, parsedSubQuestion)
		row, _, err = rows.NextNeo()
	}

	return NewRQ(extract, subquestions)
}

func parseRSQ(node graph.Node) JsonEncodable {
	p := node.Properties
    if answer, isSARSQ := p["answer"]; isSARSQ {
        return NewSARSQ(p["index"].(int64), p["given"].(string), answer.(string))
    } else if answers, isMARSQ := p["answers"]; isMARSQ {
        return NewMARSQ(p["index"].(int64), p["given"].(string), toStrings(answers.([]interface{})))
    } else {
        log.Printf("RSQ node had neither answer nor answers property")
        panic("neo4jdatabase:parseRSQ")
    }
}

// ====== Common =========

func openConnection() driver.Conn {
	conn, err := driver.NewDriver().OpenNeo(Neo4jURL)
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

func onlyNode(row []interface{}) graph.Node {
	node := row[0].(graph.Node)
	return node
}
