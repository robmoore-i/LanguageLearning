import os
import time

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


def main():
    print("=== starting backend ===")
    start_backend_q()
    time.sleep(1)

    print("=== starting tests ===")
    tests()

    print("=== killing backend ===")
    kill_backend_q()

    print("=== finished tests ===")


main()
exit(0)
