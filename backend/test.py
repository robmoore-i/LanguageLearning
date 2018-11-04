#!/usr/bin/python3

import os
import requests
import sys
import time
from assertpy import assert_that


def start_backend():
    os.system("./bin/src &")


def stop_backend():
    os.system("pkill -f ./bin/src")


def lesson_names():
    res = requests.get("http://localhost:8000/lessonnames")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(sorted(res.json())).is_equal_to(sorted(["Colours", "Hello", "What are you called?"]))
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")


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


def courses():
    res = requests.get("http://localhost:8000/courses")

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")

    georgian = res.json()[0]
    assert_that(georgian["name"]).is_equal_to("Georgian")
    assert_that(georgian["imageType"]).is_equal_to("svg")
    assert_that(georgian["image"]).is_equal_to(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"900\" height=\"600\" viewBox=\"0 0 300 200\">\n<defs>\n<g id=\"smallcross\"><clipPath id=\"vclip\"><path d=\"M-109,104 a104,104 0 0,0 0,-208 H109 a104,104 0 0,0 0,208 z\"/></clipPath><path id=\"varm\" d=\"M-55,74 a55,55 0 0,1 110,0 V-74 a55,55 0 0,1 -110,0 z\" clip-path=\"url(#vclip)\"/>\n<use xlink:href=\"#varm\" transform=\"rotate(90)\"/></g>\n</defs>\n<rect width=\"300\" height=\"200\" style=\"fill:#fff\"/>\n<path d=\"m 130,0 0,80 -130,0 L 0,120 l 130,0 0,80 40,0 0,-80 130,0 0,-40 -130,0 L 170,0 130,0 z\" style=\"fill:#ff0000\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,160.55)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(235.55,39.45)\" fill=\"#f00\"/>\n<use xlink:href=\"#smallcross\" transform=\"translate(64.45,160.55)\" fill=\"#f00\"/>\n</svg>")
    assert_that(sorted(georgian.keys())).is_equal_to(["image", "imageType", "name"])


def readingQuestion():
    payload = {"lessonName": "Colours"}
    res = requests.post("http://localhost:8000/lesson", json=payload)

    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")

    resJson = res.json()
    assert_that(resJson["name"]).is_equal_to("Colours")
    questions = resJson["questions"]
    assert_that(len(questions)).is_equal_to(1)
    assert_that(questions).is_equal_to(
        [{"type": 2,
         "extract": "მატარებელი ლურჯია და მანქანა წითელი არის",
         "questions": [
             {
                 "given": "What colour is the train?",
                 "answer": "blue"
             },
             {
                 "given": "What colour is the car?",
                 "answer": "red"
             }]
         }])
    assert_that(sorted(resJson.keys())).is_equal_to(["name", "questions"])


def run_test(test_name, test):
    try:
        print("- " + test_name)
        test()
    except AssertionError as e:
        print("fail\n\t" + str(e))
    except Exception as e:
        print("error\n\t" + str(e))


def tests():
    run_test("lesson_names", lesson_names)
    run_test("lesson", lesson)
    run_test("courses", courses)
    run_test("readingQuestion", readingQuestion)


usage = "USAGE: ./test.py [a|r]\na => don't start the server because it's (a)lready running.\nr => (r)un the server."

def main():
    print("Running: " + str(sys.argv))

    if len(sys.argv) != 2:
        print(usage)
        exit(1)
    elif sys.argv[1] == "a":  # 'a' is for 'already running'
        start_server = False
    elif sys.argv[1] == "r":  # 'r' is for 'run it yourself'
        start_server = True
    else:
        print(usage)
        exit(1)

    if start_server:
        print("=== starting backend ===")
        start_backend()
        time.sleep(1)

    print("=== starting tests ===")
    tests()

    if start_server:
        print("=== killing backend ===")
        stop_backend()

    print("=== finished tests ===")


main()
exit(0)
