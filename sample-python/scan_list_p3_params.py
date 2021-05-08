# This Python3 script will query for a list of scans
# including limit and offset values of a scan

import json
import time
import hmac
import base64
import hashlib
import requests
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Obtain a CloudSploit API key and secret from the dashboard
api_key = os.getenv('API_KEY')
secret = os.getenv('API_SECRET')

# Include limit and offset here
# Set the limit=1 and remove "offset" entirely (don't set to 0)
# to retrieve the latest scan
limit="1"
offset="5"

endpoint = "https://api.cloudsploit.com"
path = "/v2/scans"
args = "?limit=" + limit + "&offset=" + offset
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

r=requests.get(endpoint + path + args, headers=hdr);

print(r.text)
