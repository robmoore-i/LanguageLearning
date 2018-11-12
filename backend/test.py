import os
import requests
import sys
import time

from rest_test import *
from assertpy import assert_that

def start_backend():
    os.system("./bin/src &")

def stop_backend():
    os.system("pkill -f ./bin/src")

@test
def lesson_names():
    res = requests.get("http://localhost:8000/lessonnames?course=Georgian")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(sorted(res.json())).is_equal_to(sorted(["Colours", "Hello", "What are you called?"]))
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")

@test
def lesson():
    payload = {"lessonName": "Hello"}
    res = requests.post("http://localhost:8000/lesson", json=payload)

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")

    resJson = res.json()
    assert_that(resJson["name"]).is_equal_to("Hello")
    assert_that(sorted(resJson["questions"], key=lambda q: q["type"])).is_equal_to([
        {'type': 0, 'given': 'Hello', 'answer': 'გამარჯობა'},
        {'type': 1, 'question': 'sounds like "i" in English', 'a': 'ა', 'b': 'ო', 'c': 'უ', 'd': 'ი', 'answer': 'd'}
    ])
    assert_that(sorted(resJson.keys())).is_equal_to(["name", "questions"])

@test
def courses():
    res = requests.get("http://localhost:8000/courses")

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")

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
        assert_that(sorted(course.keys())).is_equal_to(["image", "imageType", "name"])

    res_json = res.json()
    if res_json[0]["name"] == "Georgian":
        assert_is_georgian_course(res_json[0])
        assert_is_french_course(res_json[1])
    elif res_json[1]["name"] == "Georgian":
        assert_is_georgian_course(res_json[1])
        assert_is_french_course(res_json[0])
    else:
        raise Exception()

@test
def readingQuestion():
    payload = {"lessonName": "Colours"}
    res = requests.post("http://localhost:8000/lesson", json=payload)

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")

    resJson = res.json()
    assert_that(resJson["name"]).is_equal_to("Colours")
    questions = resJson["questions"]
    assert_that(len(questions)).is_equal_to(1)
    assert_that(sorted(resJson.keys())).is_equal_to(["name", "questions"])
    rq = questions[0]
    assert_that(rq["type"]).is_equal_to(2)
    assert_that(rq["extract"]).is_equal_to("მატარებელი ლურჯია და მანქანა წითელი არის")

    assert_that(len(rq["questions"])).is_equal_to(2)
    if rq["questions"][0]["answer"] == "blue":
        assert_that(rq["questions"][0]["given"]).is_equal_to("What colour is the train?")
        assert_that(rq["questions"][1]["given"]).is_equal_to("What colour is the car?")
        assert_that(rq["questions"][1]["answer"]).is_equal_to("red")
    elif rq["questions"][0]["answer"] == "red":
        assert_that(rq["questions"][0]["given"]).is_equal_to("What colour is the car?")
        assert_that(rq["questions"][1]["given"]).is_equal_to("What colour is the train?")
        assert_that(rq["questions"][1]["answer"]).is_equal_to("blue")
    else:
        raise Exception()


main(locals(), start_backend, stop_backend)
exit(0)
