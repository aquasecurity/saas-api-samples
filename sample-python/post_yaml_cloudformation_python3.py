# This Python script will submit a POST to the
# CloudFormation scan API endpoint to obtain
# potential security risks for a given template.

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

# Get the sample.zip
os.chdir('../')
path = os.getcwd()

# Load a YAML file from disk
yaml_file_path = path + "/sample_cf.yaml"

endpoint = "https://api.cloudsploit.com"
path = "/v2/cloudformations"
method = "POST"
timestamp = str(int(time.time() * 1000))

# Load the YAML file
with open(yaml_file_path, 'rb') as yaml_file:
    yaml_base64=base64.b64encode(yaml_file.read())

body = {
	"base64": yaml_base64.decode()
}

body_str = json.dumps(body, separators=(',', ':'))

string = timestamp + method + path + body_str
secret_bytes = bytes(secret, 'utf-8')
string_bytes = bytes(string, 'utf-8')
signature = hmac.new(secret_bytes, msg=string_bytes, digestmod=hashlib.sha256).hexdigest()

hdr = {
	"Accept": "application/json",
	"X-API-Key": api_key,
	"X-Signature": signature,
	"X-Timestamp": timestamp,
	"content-type": "application/json"
}

r=requests.post(endpoint + path, headers=hdr, data=body_str);

print(r.text)
