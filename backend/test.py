#!/usr/bin/python3

import os
import time
import sys

import requests
from assertpy import assert_that

def start_backend():
    os.system("./bin/src &")


def stop_backend():
    os.system("pkill -f ./bin/src")


def lesson_names():
    res = requests.get("http://localhost:8000/lessonnames")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.json()).is_equal_to(["Hello", "What are you called?"])
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
    assert_that(georgian["image"]).is_equal_to("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iOTAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiPgo8ZGVmcz4KPGcgaWQ9InNtYWxsY3Jvc3MiPjxjbGlwUGF0aCBpZD0idmNsaXAiPjxwYXRoIGQ9Ik0tMTA5LDEwNCBhMTA0LDEwNCAwIDAsMCAwLC0yMDggSDEwOSBhMTA0LDEwNCAwIDAsMCAwLDIwOCB6Ii8+PC9jbGlwUGF0aD48cGF0aCBpZD0idmFybSIgZD0iTS01NSw3NCBhNTUsNTUgMCAwLDEgMTEwLDAgVi03NCBhNTUsNTUgMCAwLDEgLTExMCwwIHoiIGNsaXAtcGF0aD0idXJsKCN2Y2xpcCkiLz4KPHVzZSB4bGluazpocmVmPSIjdmFybSIgdHJhbnNmb3JtPSJyb3RhdGUoOTApIi8+PC9nPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBzdHlsZT0iZmlsbDojZmZmIi8+CjxwYXRoIGQ9Im0gMTMwLDAgMCw4MCAtMTMwLDAgTCAwLDEyMCBsIDEzMCwwIDAsODAgNDAsMCAwLC04MCAxMzAsMCAwLC00MCAtMTMwLDAgTCAxNzAsMCAxMzAsMCB6IiBzdHlsZT0iZmlsbDojZmYwMDAwIi8+Cjx1c2UgeGxpbms6aHJlZj0iI3NtYWxsY3Jvc3MiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0LjQ1LDM5LjQ1KSIgZmlsbD0iI2YwMCIvPgo8dXNlIHhsaW5rOmhyZWY9IiNzbWFsbGNyb3NzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMzUuNTUsMTYwLjU1KSIgZmlsbD0iI2YwMCIvPgo8dXNlIHhsaW5rOmhyZWY9IiNzbWFsbGNyb3NzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMzUuNTUsMzkuNDUpIiBmaWxsPSIjZjAwIi8+Cjx1c2UgeGxpbms6aHJlZj0iI3NtYWxsY3Jvc3MiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0LjQ1LDE2MC41NSkiIGZpbGw9IiNmMDAiLz4KPC9zdmc+")


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


usage = "USAGE: ./test.py [a|r]\na => don't start the server because it's (a)lready running.\nr => (r)un the server."

def main():
    print("Running: " + str(sys.argv))

    if len(sys.argv) != 2:
        print(usage)
        exit(1)
    elif sys.argv[1] == "a": # 'a' is for 'already running'
        start_server = False
    elif sys.argv[1] == "r": # 'r' is for 'run it yourself'
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
