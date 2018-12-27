import os
import requests
import time

from rest_test import *
from assertpy import assert_that
from neo4j import GraphDatabase

neo4j_port = int(os.environ["MELANGE_NEO4J_PORT"])
neo4j_user = os.environ["MELANGE_NEO4J_USER"]
neo4j_pw = os.environ["MELANGE_NEO4J_PW"]
neo4j_url = "bolt://localhost:" + str(neo4j_port)
driver = GraphDatabase.driver(neo4j_url, auth=(neo4j_user, neo4j_pw))

server_port = int(os.environ["MELANGE_SERVER_PORT"])
frontend_port = int(os.environ["MELANGE_FRONTEND_PORT"])


@setup
def start_server():
    os.system("./../bin/src &")


@teardown
def stop_server():
    os.system("pkill -f bin/src")


# Finds the (first) entry in a (l)ist of maps where (f)ield equals (v)alue.
def maplist_where(l, f, v):
    return [m for m in l if m[f] == v][0]


global cleanup_query
cleanup_query = """;"""


@after_each
def cleanup():
    global cleanup_query
    with driver.session() as session:
        session.run("MATCH (n) DETACH DELETE (n)")
        session.run("MATCH (n) DELETE (n)")


@test
def can_get_svg_course_img():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (georgian:Course {name: "SvgTest", image: "flagGeorgia.svg"})
            CREATE (georgian)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
            CREATE (georgian)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
            CREATE (georgian)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
            RETURN georgian,hello,whatAreYouCalled,colours;
            """)

    # Query the server
    res = requests.get("http://localhost:" + str(server_port) + "/courses")
    # Assert the response

    svg_course = maplist_where(res.json(), "name", "SvgTest")

    assert_that(svg_course["imageType"]).is_equal_to("svg")
    assert_that(svg_course["image"]).is_equal_to(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"900\" height=\"600\" viewBox=\"0 0 300 200\">\n<defs>\n<g id=\"smallcross\"><clipPath id=\"vclip\"><path d=\"M-109,104 a104,104 0 0,0 0,-208 H109 a104,104 0 0,0 0,208 z\"/></clipPath><path id=\"varm\" d=\"M-55,74 a55,55 0 0,1 110,0 V-74 a55,55 0 0,1 -110,0 z\" clip-path=\"url(#vclip)\"/>\n<use xlink:href=\"#varm\" transform=\"rotate(90)\"/></g>\n</defs>\n<rect width=\"300\" height=\"200\" style=\"fill:#fff\"/>\n<path d=\"m 130,0 0,80 -130,0 L 0,120 l 130,0 0,80 40,0 0,-80 130,0 0,-40 -130,0 L 170,0 130,0 z\" style=\"fill:#ff0000\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,160.55)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,160.55)\" fill=\"#f00\"/>\n</svg>")


@test
def can_get_png_course_img():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (c:Course {name: "PngTest", image: "flagFrance.png"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(l1:TopicLesson {name: "l3"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(l2:TopicLesson {name: "l2"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(l3:TopicLesson {name: "l1"})
            RETURN c,l1,l2,l3;
            """)

    # Query the server
    res = requests.get("http://localhost:" + str(server_port) + "/courses")
    # Assert the response

    png_course = maplist_where(res.json(), "name", "PngTest")

    assert_that(png_course["imageType"]).is_equal_to("png")
    assert_that(png_course["image"]).is_equal_to(
        "iVBORw0KGgoAAAANSUhEUgAAB9AAAAU1BAMAAAC5AEJSAAAAD1BMVEUAI5XtKTlacbrzdX/////aEUguAAAAAWJLR0QEj2jZUQAACxVJREFUeNrt00ERACAMBDGKEh74l1JL1MT9SCTszNYi5x4NYl5rkLMlAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9ElAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9ElAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOnxpAOPYDHtQJb3+AAAAAElFTkSuQmCC")


@test
def can_get_jpg_course_img():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (c:Course {name: "JpgTest", image: "flagGermany.jpg"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(l1:TopicLesson {name: "l3"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(l2:TopicLesson {name: "l2"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(l3:TopicLesson {name: "l1"})
            RETURN c,l1,l2,l3;
            """)

    # Query the server
    res = requests.get("http://localhost:" + str(server_port) + "/courses")
    # Assert the response

    png_course = maplist_where(res.json(), "name", "JpgTest")

    assert_that(png_course["imageType"]).is_equal_to("jpg")
    assert_that(png_course["image"]).is_equal_to(
        "/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gNzAK/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8AAEQgCZgQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8ZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAorW/4R+f8A57R/rR/wj8//AD2j/Wsfb0+56X9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wN6iiivHP0YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAor1j/hHtH/AOgbb/8AfFH/AAj2j/8A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gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z")


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
def courses_endpoint_gives_200_and_cors_header():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (georgian:Course {name: "Georgian", image: "flagGeorgia.svg"})
            CREATE (french:Course {name: "French", image: "flagFrance.png"})
            CREATE (german:Course {name: "German", image: "flagGermany.jpg"})
            RETURN georgian,french,german;
            """)

    # Query the server
    res = requests.get("http://localhost:" + str(server_port) + "/courses")

    # Assert the response
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")


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
def course_metadata_gives_200_and_cors_header():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (c:Course {name: "Course", image: "flagGeorgia.svg"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
            RETURN hello,whatAreYouCalled,colours,c;
            """)

    # Query the server
    res = requests.get("http://localhost:" + str(server_port) + "/coursemetadata?course=Course")

    # Assert the response
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")


@test
def can_get_lesson_order_for_course():
    # Seed the database
    with driver.session() as session:
        session.run(
            """
            CREATE (c:Course {name: "Course", image: "flagGeorgia.svg"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 0}]->(hello:TopicLesson {name: "Hello"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 1}]->(whatAreYouCalled:TopicLesson {name: "What are you called?"})
            CREATE (c)-[:HAS_TOPIC_LESSON {index: 2}]->(colours:TopicLesson {name: "Colours"})
            RETURN hello,whatAreYouCalled,colours,c;
            """)

    # Query the server
    res = requests.get("http://localhost:" + str(server_port) + "/coursemetadata?course=Course")

    # Assert the response
    lesson_metadata = res.json()["lessonMetadata"]
    hello_lesson = maplist_where(lesson_metadata, "name", "Hello")
    what_are_you_called_lesson = maplist_where(lesson_metadata, "name", "What are you called?")
    colours_lesson = maplist_where(lesson_metadata, "name", "Colours")

    assert_that(hello_lesson["index"]).is_equal_to(0)
    assert_that(what_are_you_called_lesson["index"]).is_equal_to(1)
    assert_that(colours_lesson["index"]).is_equal_to(2)


exit(main(locals()))
