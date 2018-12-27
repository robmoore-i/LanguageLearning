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

	return parseCourseRows(rows)
}

func parseCourseRows(rows driver.Rows) []Course {
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
        log.Printf("Image is none of [svg | png | jpg]")
        panic("neo4jdatabase:parseCourse")
    }
}

// Returns a 3 letter file extension for the image type. svg, png or jpg.
func parseImageType(filename string) string {
    if len(filename) < 4 {
        log.Printf("Image filename is too short (< 4 characters, including file extension)")
        panic("neo4jdatabase:parseImageType")
    }
    if filename[len(filename) - 4:] == "jpeg" {
        return "jpg"
    } else {
        return filename[len(filename) - 3:]
    }
}

// ====== Course Metadata =========

func QueryCourseMetadata(course string) CourseMetadata {
    cypher := `MATCH (c:Course {name: {course}})-[r:HAS_TOPIC_LESSON]->(l) RETURN l.name,r.index`
    params := map[string]interface{}{"course": course}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

    return CourseMetadata{LessonMetadata: parseLessonMetadataRows(rows)}
}

func parseLessonMetadataRows(rows driver.Rows) []LessonMetadata {
    var courseLessonMetadata []LessonMetadata
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
        name := row[0].(string)
        index := row[1].(int64)
        lessonMetadata := LessonMetadata{Name: name, Index: index}
        courseLessonMetadata = append(courseLessonMetadata, lessonMetadata)
		row, _, err = rows.NextNeo()
	}
    return courseLessonMetadata
}

// ====== Lesson =========

func QueryLesson(lessonName string) Lesson {
    lessonIndex := QueryLessonIndex(lessonName)

	cypher := `MATCH (tl:TopicLesson {name: {name}})-[:HAS_QUESTION]->(q) RETURN q`
	params := map[string]interface{}{"name": lessonName}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

	return Lesson{Name: lessonName, Questions: parseJsonEncodableRows(rows, parseQuestion), Index: lessonIndex}
}

func QueryLessonIndex(lessonName string) int64 {
    cypher := `MATCH (tl:TopicLesson {name: {name}})<-[r:HAS_TOPIC_LESSON]-(c:Course) RETURN r.index`
    params := map[string]interface{}{"name": lessonName}
    rows, conn, stmt := performQuery(cypher, params)
    defer conn.Close()
    defer stmt.Close()
    row, _, err := rows.NextNeo()
    if err != nil {
        log.Printf("%v", err)
        log.Printf("There was a problem getting the index of lesson %#v", lessonName)
		panic("neo4jdatabase:QueryLessonIndex")
    }
    return row[0].(int64)
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
    index := p["index"].(int64)
    if answer, isSATQ := p["answer"]; isSATQ {
        return NewSATQ(index, p["given"].(string), answer.(string))
    } else if answers, isMATQ := p["answers"]; isMATQ {
        return NewMATQ(index, p["given"].(string), toStrings(answers.([]interface{})))
    } else {
        log.Printf("TQ node had neither answer nor answers property")
        panic("neo4jdatabase:parseTQ")
    }
}

func parseMCQ(node graph.Node) JsonEncodable {
	p := node.Properties
	return NewMCQ(p["index"].(int64), p["question"].(string), p["a"].(string), p["b"].(string), p["c"].(string), p["d"].(string), p["answer"].(string))
}

func parseRQ(node graph.Node) JsonEncodable {
	p := node.Properties
    course := p["course"].(string)
    lesson := p["lesson"].(string)
    index := p["index"].(int64)
	extract := parseRQExtract(p)

	cypher := "MATCH (rq:ReadingQuestion {course: {course}, lesson: {lesson}, index: {index}})-[:HAS_SUBQUESTION]->(q:ReadingSubQuestion) RETURN q"
	params := map[string]interface{}{"course": course, "lesson": lesson, "index": index}
	rows, conn, stmt := performQuery(cypher, params)
	defer conn.Close()
	defer stmt.Close()

	return NewRQ(index, extract, parseJsonEncodableRows(rows, parseRSQ))
}

func parseRQExtract(nodeProperties map[string]interface {}) string {
    if inlineExtract, hasInlineExtract := nodeProperties["extractInline"]; hasInlineExtract {
        return inlineExtract.(string)
    } else if extractFileRelPath, hasExtractFile := nodeProperties["extractFile"]; hasExtractFile {
        path := strings.Join([]string{ExtractsPath, extractFileRelPath.(string)}, "")
        bytes, err := ioutil.ReadFile(path)
        if err != nil {
            log.Printf("Couldn't read RQ extract from path %#v", path)
            panic("neo4jdatabase:parseRQExtract")
        }
        return string(bytes)
    } else {
        log.Printf("RQ node has neither extractInline nor extractFile property")
        panic("neo4jdatabase:parseRQExtract")
    }
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

type JsonEncodableParse func(graph.Node) JsonEncodable

func parseJsonEncodableRows(rows driver.Rows, parse JsonEncodableParse) []JsonEncodable {
    var encodables []JsonEncodable
	row, _, err := rows.NextNeo()
	for row != nil && err == nil {
		node := onlyNode(row)
		parsedEncodable := parse(node)
		encodables = append(encodables, parsedEncodable)
		row, _, err = rows.NextNeo()
	}
    return encodables
}

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
