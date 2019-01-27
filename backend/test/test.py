import os
import requests
import time

from rest_test import *
from assertpy import assert_that
from neo4j import GraphDatabase

neo4j_port = int(os.environ["APP_NEO4J_PORT"])
neo4j_user = os.environ["APP_NEO4J_USER"]
neo4j_pw = os.environ["APP_NEO4J_PW"]
neo4j_url = "bolt://localhost:" + str(neo4j_port)
driver = GraphDatabase.driver(neo4j_url, auth=(neo4j_user, neo4j_pw))

server_port = int(os.environ["APP_LEGACY_SERVER_PORT"])
frontend_port = int(os.environ["APP_FRONTEND_PORT"])


# Finds the (first) entry in a (l)ist of maps where (f)ield equals (v)alue.
def maplist_where(l, f, v):
    return [m for m in l if m[f] == v][0]


global cleanup_query
cleanup_query = """
"""


@after_each
def cleanup():
    global cleanup_query
    with driver.session() as session:
        session.run("MATCH (n) DETACH DELETE (n)")
        session.run("MATCH (n) DELETE (n)")


@test
def can_get_lesson_with_mcq():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (hello:TopicLesson {name: "MCQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
            CREATE (hello)-[:HAS_QUESTION {index: 1}]->(letterA:Question:MultipleChoiceQuestion {question: "sounds like \\"a\\" in English", a: "მ",b:"ბ", c:"გ", d:"ა", answer: "d"})
            RETURN hello,letterA,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "MCQ"})

    # Assert the response
    lesson = res.json()
    questions = lesson["questions"]

    expected_mcq = {'index': 1, 'type': 1, 'question': 'sounds like "a" in English',
                    'a': 'მ', 'b': 'ბ', 'c': 'გ', 'd': 'ა', 'answer': 'd'}
    assert_that(type(questions).__name__).is_equal_to('list')
    assert_that(len(questions)).is_equal_to(1)
    mcq = questions[0]
    assert_that(type(mcq).__name__).is_equal_to('dict')
    assert_that(mcq).is_equal_to(expected_mcq)


@test
def can_get_lesson_with_tq():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (l:TopicLesson {name: "TQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
            CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "What are you called?", answer: "შენ რა გქვია?"})
            RETURN l,tq,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "TQ"})

    # Assert the response
    lesson = res.json()
    questions = lesson["questions"]

    expected_tq = {'index': 0, 'type': 0, 'given': 'What are you called?', 'answer': 'შენ რა გქვია?'}
    tq = questions[0]
    assert_that(type(tq).__name__).is_equal_to('dict')
    assert_that(tq).is_equal_to(expected_tq)


@test
def can_get_lesson_with_rq():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (l:TopicLesson {name: "RQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
            CREATE (l)-[:HAS_QUESTION {index: 10}]->(rq:Question:ReadingQuestion {extractInline: "memes"})
            CREATE (rq)-[:HAS_SUBQUESTION {index: 0}]->(rsq:ReadingSubQuestion {given:"What does 'საქართველო' mean in English?", answer:"Georgia"})
            RETURN l,rq,rsq,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "RQ"})

    # Assert the response
    lesson = res.json()
    questions = lesson["questions"]

    rq = questions[0]
    assert_that(type(rq).__name__).is_equal_to('dict')
    assert_that(rq['type']).is_equal_to(2)
    assert_that(rq['index']).is_equal_to(10)
    sub_questions = rq['questions']
    assert_that(type(sub_questions).__name__).is_equal_to('list')
    assert_that(len(sub_questions)).is_equal_to(1)
    rsq = sub_questions[0]
    assert_that(type(rsq).__name__).is_equal_to('dict')
    assert_that(rsq['given']).is_equal_to("What does 'საქართველო' mean in English?")
    assert_that(rsq['answer']).is_equal_to("Georgia")
    assert_that(rsq['index']).is_equal_to(0)


@test
def can_get_lesson_with_rq_with_rsq_with_multiple_answers():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (l:TopicLesson {name: "MARSQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
            CREATE (l)-[:HAS_QUESTION {index: 0}]->(rq:Question:ReadingQuestion {extractInline: "memes"})
            CREATE (rq)-[:HAS_SUBQUESTION {index: 0}]->(rsq1:ReadingSubQuestion {given:"What does 'საქართველო' mean in English?", answer:"Georgia"})
            CREATE (rq)-[:HAS_SUBQUESTION {index: 1}]->(rsq2:ReadingSubQuestion {given:"What does 'ცისფერი' mean in English?", answers:["Blue", "Sky blue"]})
            RETURN l,rq,rsq1,rsq2,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "MARSQ"})

    # Assert the response
    lesson = res.json()
    questions = lesson["questions"]
    rq = questions[0]
    sub_questions = rq['questions']

    marsq = maplist_where(sub_questions, "given", "What does 'ცისფერი' mean in English?")

    assert_that(type(marsq['answers']).__name__).is_equal_to("list")
    assert_that(marsq['index']).is_equal_to(1)
    assert_that(marsq['answers']).contains("Blue")
    assert_that(marsq['answers']).contains("Sky blue")


@test
def can_get_lesson_with_tq_with_multiple_answers():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (l:TopicLesson {name: "MATQ"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
            CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "ცისფერი", answers: ["blue", "sky colour", "light blue"]})
            RETURN l,tq,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "MATQ"})

    # Assert the response
    lesson = res.json()
    questions = lesson["questions"]

    tq = questions[0]
    assert_that(type(tq['answers']).__name__).is_equal_to("list")
    assert_that(tq['answers']).contains("blue")
    assert_that(tq['answers']).contains("sky colour")
    assert_that(tq['answers']).contains("light blue")


@test
def lesson_endpoint_gives_200_and_cors_header():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (l:TopicLesson {name: "Q"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "c", image: "img.png"})
            CREATE (l)-[:HAS_QUESTION {index: 0}]->(tq:Question:TranslationQuestion {given: "ცისფერი", answers: ["blue", "sky colour", "light blue"]})
            RETURN l,tq,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "Q"})

    # Assert the response
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")


@test
def can_get_lesson_with_mcq_with_three_choices():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (toBe:TopicLesson {name: "MCQ3"})<-[:HAS_TOPIC_LESSON {index: 0}]-(c:Course {name: "Georgian", image: "img.png"})
            CREATE (toBe)-[:HAS_QUESTION {index: 1}]->(singularToBe:Question:MultipleChoiceQuestion {question: "means \\"I am\\" in English", a: "მე ვარ", b: "შენ ხარ", c: "ის არის", answer: "a"})
            RETURN toBe,singularToBe,c;
            """)

    # Query the server
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json={"lessonName": "MCQ3"})

    # Assert the response
    lesson = res.json()
    questions = lesson["questions"]

    expected_mcq = {'index': 1, 'type': 1, 'question': 'means "I am" in English',
                    'a': 'მე ვარ', 'b': 'შენ ხარ', 'c': 'ის არის', 'd': '!', 'answer': 'a'}
    assert_that(type(questions).__name__).is_equal_to('list')
    assert_that(len(questions)).is_equal_to(1)
    mcq = questions[0]
    assert_that(type(mcq).__name__).is_equal_to('dict')
    assert_that(mcq).is_equal_to(expected_mcq)


exit(main(locals()))
