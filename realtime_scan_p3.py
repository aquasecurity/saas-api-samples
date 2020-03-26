# This Python script will submit a POST to the
# realtime scan API endpoint to initiate a new
# scan. It then polls the endpoint for results.

import sys
import json
import time
import hmac
import base64
import hashlib
import requests

# Obtain a CloudSploit API key and secret from the dashboard
api_key = "replace-with-key"
secret = "replace-with-secret"
key_id = 123	# The key_id you want to scan (obtain this via GET /keys)

base_url = "https://api.cloudsploit.com"
interval = 5 # Decreasing this value will result in being rate limited

def make_call(method, path, body):
	timestamp = str(int(time.time() * 1000))
	endpoint = base_url + path;

	if body:
		body_str = json.dumps(body, separators=(',', ':'))
	else:
		body_str = ""

	string = timestamp + method + path + body_str

	secret_bytes= bytes(secret , 'latin-1')
	string_bytes = bytes(string, 'latin-1')

	signature = hmac.new(secret_bytes, msg=string_bytes, digestmod=hashlib.sha256).hexdigest()

	hdr = {
		"Accept": "application/json",
		"X-API-Key": api_key,
		"X-Signature": signature,
		"X-Timestamp": timestamp,
		"content-type": "application/json"
	}

	# print method + " " + endpoint

	if method is "POST":
		r=requests.post(endpoint, headers=hdr, data=body_str);
	else:
		r=requests.get(endpoint, headers=hdr);

	return r.text

body = {
	"key_id": key_id,
	"save": True
}

realtime_scan = make_call("POST", "/v2/realtimes", body)

if realtime_scan is None:
	print("Error initiating realtime scan: " + realtime_scan)
	sys.exit()

realtime_json = json.loads(realtime_scan)

if "errors" in realtime_json:
	print(json.dumps(realtime_json, indent=4, separators=(',', ': ')))
	sys.exit()

realtime_id = realtime_json["data"]["realtime_id"]

if realtime_id is None:
	print("Error obtaining realtime ID")
	sys.exit()

print("Scan created with realtime ID: " + str(realtime_id))

while True:
	print("Polling for results...")
	realtime_result = make_call("GET", "/v2/realtimes/" + str(realtime_id), None)
	realtime_result_json = json.loads(realtime_result)
	realtime_status = realtime_result_json["data"]["status"]

	if realtime_status != "COMPLETE":
		print(realtime_result)
		time.sleep(interval)
	else:
		print(json.dumps(realtime_result_json, indent=4, separators=(',', ': ')))
		sys.exit()
