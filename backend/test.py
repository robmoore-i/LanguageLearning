import os
import requests
import sys
import time

from rest_test import *
from assertpy import assert_that

server_port = int(os.environ["MELANGE_SERVER_PORT"])
frontend_port = int(os.environ["MELANGE_FRONTEND_PORT"])

@setup
def start_server():
    os.system("./bin/src &")

@teardown
def stop_server():
    os.system("pkill -f ./bin/src")

@test
def lesson():
    payload = {"lessonName": "Hello"}
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json=payload)

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")

    resJson = res.json()
    assert_that(resJson["name"]).is_equal_to("Hello")
    assert_that(resJson["index"]).is_equal_to(0)
    assert_that(sorted(resJson["questions"], key=lambda q: q["type"])).is_equal_to([
        {'index': 1, 'type': 0, 'given': 'Hello', 'answer': 'გამარჯობა'},
        {'index': 0, 'type': 1, 'question': 'sounds like "i" in English', 'a': 'ა', 'b': 'ო', 'c': 'უ', 'd': 'ი', 'answer': 'd'}
    ])
    assert_that(sorted(resJson.keys())).is_equal_to(["index", "name", "questions"])

@test
def courses():
    res = requests.get("http://localhost:" + str(server_port) + "/courses")

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")

    def assert_is_georgian_course(course):
        assert_that(course["name"]).is_equal_to("Georgian")
        assert_that(course["imageType"]).is_equal_to("svg")
        assert_that(course["image"]).is_equal_to(
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"900\" height=\"600\" viewBox=\"0 0 300 200\">\n<defs>\n<g id=\"smallcross\"><clipPath id=\"vclip\"><path d=\"M-109,104 a104,104 0 0,0 0,-208 H109 a104,104 0 0,0 0,208 z\"/></clipPath><path id=\"varm\" d=\"M-55,74 a55,55 0 0,1 110,0 V-74 a55,55 0 0,1 -110,0 z\" clip-path=\"url(#vclip)\"/>\n<use xlink:href=\"#varm\" transform=\"rotate(90)\"/></g>\n</defs>\n<rect width=\"300\" height=\"200\" style=\"fill:#fff\"/>\n<path d=\"m 130,0 0,80 -130,0 L 0,120 l 130,0 0,80 40,0 0,-80 130,0 0,-40 -130,0 L 170,0 130,0 z\" style=\"fill:#ff0000\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,160.55)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,160.55)\" fill=\"#f00\"/>\n</svg>")
        assert_that(sorted(course.keys())).is_equal_to(["image", "imageType", "name"])

    def assert_is_french_course(course):
        assert_that(course["name"]).is_equal_to("French")
        assert_that(course["imageType"]).is_equal_to("png")
        assert_that(course["image"]).is_equal_to(
            "iVBORw0KGgoAAAANSUhEUgAAB9AAAAU1BAMAAAC5AEJSAAAAD1BMVEUAI5XtKTlacbrzdX/////aEUguAAAAAWJLR0QEj2jZUQAACxVJREFUeNrt00ERACAMBDGKEh74l1JL1MT9SCTszNYi5x4NYl5rkLMlAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9ElAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9ElAKMDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdDA6YHTA6IDRAaMDRgeMDhgdjA4YHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaOD0QGjA0YHjA4YHTA6YHTA6GB0wOiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOhgdMDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB6MDRgeMDhgdMDpgdMDogNHB6IDRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYHTA6YHTA6IDRAaMDRgeMDkYHjA4YHTA6YHTA6IDRAaMDRgejA0YHjA4YHTA6YHTA6IDRweiA0QGjA0YHjA4YHTA6YHQwOmB0wOiA0QGjA0YHjA4YHTA6GB0wOmB0wOiA0QGjA0YHjA5GB4wOGB0wOmB0wOiA0QGjg9EBowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0MDpgdMDogNEBowNGB4wOGB2MDhgdMDpgdMDogNEBowNGB4wORgeMDhgdMDpgdMDogNEBo4PRAaMDRgeMDhgdMDpgdMDoYHTA6IDRAaMDRgeMDhgdMDoYXQIwOmB0wOiA0QGjA0YHjA4YHYwOGB0wOmB0wOiA0QGjA0YHowNGB4wOGB0wOmB0wOiA0cHogNEBowNGB4wOGB0wOmB0wOhgdMDogNEBowNGB4wOGB0wOnxpAOPYDHtQJb3+AAAAAElFTkSuQmCC")

    def assert_is_german_course(course):
        assert_that(course["name"]).is_equal_to("German")
        assert_that(course["imageType"]).is_equal_to("jpg")
        assert_that(course["image"]).is_equal_to(
            "/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gNzAK/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8AAEQgCZgQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8ZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAorW/4R+f8A57R/rR/wj8//AD2j/Wsfb0+56X9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wMmitb/hH5/+e0f60f8ACPz/APPaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/AOe0f60f8I/P/wA9o/1o9vT7h/ZON/59v8DJorW/4R+f/ntH+tH/AAj8/wDz2j/Wj29PuH9k43/n2/wMmitb/hH5/wDntH+tH/CPz/8APaP9aPb0+4f2Tjf+fb/AyaK1v+Efn/57R/rR/wAI/P8A89o/1o9vT7h/ZON/59v8DJorW/4R+f8A57R/rR/wj8//AD2j/Wj29PuH9k43/n2/wN6iiivHP0YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAor1j/hHtH/AOgbb/8AfFH/AAj2j/8A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gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z")

        assert_that(sorted(course.keys())).is_equal_to(["image", "imageType", "name"])

    res_json = res.json()
    courses = {}
    for course_json in res_json:
        course_name = course_json["name"]
        courses[course_name] = course_json

    assert_is_georgian_course(courses["Georgian"])
    assert_is_french_course(courses["French"])
    assert_is_german_course(courses["German"])

@test
def readingQuestionIncludingMultipleAnswerSubQuestion():
    payload = {"lessonName": "Colours"}
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json=payload)

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")

    res_json = res.json()
    assert_that(res_json["name"]).is_equal_to("Colours")
    assert_that(res_json["index"]).is_equal_to(2)
    questions = res_json["questions"]
    assert_that(len(questions)).is_equal_to(1)
    assert_that(sorted(res_json.keys())).is_equal_to(["index", "name", "questions"])
    rq = questions[0]
    assert_that(rq["type"]).is_equal_to(2)
    assert_that(rq["extract"]).is_equal_to("მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა.")

    def assert_is_train_question(rsq):
        assert_that(rsq["given"]).is_equal_to("What colour is the train?")
        assert_that(rsq["answer"]).is_equal_to("blue")
        assert_that(rsq["index"]).is_equal_to(0)

    def assert_is_car_question(rsq):
        assert_that(rsq["given"]).is_equal_to("What colour is the car?")
        assert_that(rsq["answer"]).is_equal_to("red")
        assert_that(rsq["index"]).is_equal_to(1)

    def assert_is_grass_question(rsq):
        assert_that(rsq["given"]).is_equal_to("What is said to be green?")
        assert_that(sorted(rsq["answers"])).is_equal_to(["Grass", "The grass"])
        assert_that(rsq["index"]).is_equal_to(2)

    subquestions = {}
    for subquestion in rq["questions"]:
        given = subquestion["given"]
        subquestions[given] = subquestion

    assert_is_train_question(subquestions["What colour is the train?"])
    assert_is_car_question(subquestions["What colour is the car?"])
    assert_is_grass_question(subquestions["What is said to be green?"])

@test
def multipleAnswerTranslationQuestion():
    payload = {"lessonName": "Clothes"}
    res = requests.post("http://localhost:" + str(server_port) + "/lesson", json=payload)
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")

    resJson = res.json()
    assert_that(resJson["name"]).is_equal_to("Clothes")
    assert_that(resJson["index"]).is_equal_to(0)
    assert_that(sorted(resJson["questions"], key=lambda q: q["type"])).is_equal_to([
        {'index': 0, 'type': 0, 'given': 'Das Hemd', 'answers': ['Shirt', 'The shirt']},
    ])
    assert_that(sorted(resJson.keys())).is_equal_to(["index", "name", "questions"])

@test
def course_metadata():
    res = requests.get("http://localhost:" + str(server_port) + "/coursemetadata?course=Georgian")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:" + str(frontend_port) + "")
    res_json = res.json()
    assert_that(list(res_json.keys())).is_equal_to(["lessonMetadata"])

    def assert_is_hello_lesson(l):
        assert_that(l["name"]).is_equal_to("Hello")
        assert_that(l["index"]).is_equal_to(0)

    def assert_is_whatsyourname_lesson(l):
        assert_that(l["name"]).is_equal_to("What are you called?")
        assert_that(l["index"]).is_equal_to(1)

    def assert_is_colours_lesson(l):
        assert_that(l["name"]).is_equal_to("Colours")
        assert_that(l["index"]).is_equal_to(2)

    lessonMetadata = {}
    for l in res_json["lessonMetadata"]:
        lesson_name = l["name"]
        lessonMetadata[lesson_name] = l

    assert_is_hello_lesson(lessonMetadata["Hello"])
    assert_is_whatsyourname_lesson(lessonMetadata["What are you called?"])
    assert_is_colours_lesson(lessonMetadata["Colours"])


exit(main(locals()))
