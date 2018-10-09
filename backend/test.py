#!/usr/bin/python3

import os
import time
import sys

import requests
from assertpy import assert_that

QHOME = os.environ["QHOME"]

def start_backend_q():
    os.system(QHOME + "/l32/q backend.q &")


def kill_backend_q():
    os.system("pkill -f \"" + QHOME + "/l32/q backend.q\"")


def lesson_names():
    res = requests.get("http://localhost:8000/lessonnames")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.json()).is_equal_to(["hello", "what are you called?"])


def lesson():
    res = requests.get("http://localhost:8000/lesson/hello")
    assert_that(res.status_code).is_equal_to(200)
    assert_that(res.json()).is_equal_to({"name": "hello"})


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
        start_backend = False
    elif sys.argv[1] == "r": # 'r' is for 'run it yourself'
        start_backend = True
    else:
        print(usage)
        exit(1)

    if start_backend:
        print("=== starting backend ===")
        start_backend_q()
        time.sleep(1)

    print("=== starting tests ===")
    tests()

    if start_backend:
        print("=== killing backend ===")
        kill_backend_q()

    print("=== finished tests ===")


main()
exit(0)
