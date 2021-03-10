# This Python3 script will query for the details
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
path = "/v2/scansv2/" + scan_id
method = "GET"
timestamp = str(int(time.time() * 1000))

string = timestamp + method + path

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

r=requests.get(endpoint + path, headers=hdr);

print(r.text)
