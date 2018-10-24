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
    assert_that(res.json()).is_equal_to(["hello", "what are you called?"])
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")


def lesson():
    res = requests.get("http://localhost:8000/lesson/hello")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.json()).is_equal_to(
        {
            'name': 'hello',
            'questions': [
                {'type': 0, 'given': 'hello', 'answer': 'გამარჯობა'},
                {'type': 1, 'question': 'sounds like "i" in English', 'a': 'ა', 'b': 'ო', 'c': 'უ', 'd': 'ი', 'answer': 'd'}
            ]
        })
    assert_that(res.headers["Access-Control-Allow-Origin"]).is_equal_to("http://localhost:3000")


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
