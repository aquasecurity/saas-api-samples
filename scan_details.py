# This Python script will query for the details
# of a scan given a scan ID (with appropriate access)

import json
import time
import hmac
import base64
import hashlib
import requests

# Obtain a CloudSploit API key and secret from the dashboard
api_key = "replace-with-key"
secret = "replace-with-secret"

# Replace with the ID of the scan
scan_id = "123"

endpoint = "https://api.cloudsploit.com"
path = "/v2/scans/" + scan_id
method = "GET"
timestamp = str(int(time.time() * 1000))

string = timestamp + method + path
signature = hmac.new(secret, msg=string, digestmod=hashlib.sha256).hexdigest()

hdr = {
	"Accept": "application/json",
	"X-API-Key": api_key,
	"X-Signature": signature,
	"X-Timestamp": timestamp,
	"content-type": "application/json"
}

r=requests.get(endpoint + path, headers=hdr);

print r.text
