import unittest
import subprocess
import time
import os

from websocket import create_connection
import requests

analytics_port_str = os.environ["APP_ANALYTICS_PORT"]

class AnalyticsIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        subprocess.check_call("./../start-analytics-server.sh", shell=True)
        time.sleep(1)
    
    @classmethod
    def tearDownClass(cls):
        subprocess.check_call("./../stop-analytics-server.sh", shell=True)

    def setUp(self):
        self.ws = create_connection("ws://localhost:" + analytics_port_str)
    
    def tearDown(self):
        self.ws.close()

    def testThatCanRecordAndReturnAnEvent(self):
        session_id = "session-id"
        self.ws.send("1549820560103;" + session_id + ";event-name")

        result = self.ws.recv()
        self.assertEqual("success", result)

        response = requests.get("http://localhost:" + analytics_port_str + "/events/session/" + session_id)
        self.assertEqual(response.status_code, 200)

        json = response.json()
        self.assertEqual(1, len(json))

        matching_event = json[0]
        self.assertEqual("2019-02-10T11:19:40.000001664", matching_event["timestamp"])
        self.assertEqual("session-id", matching_event["sessionId"])
        self.assertEqual("event-name", matching_event["eventName"])


if __name__ == '__main__':
    unittest.main()