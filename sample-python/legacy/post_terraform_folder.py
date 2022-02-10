# This Python script will submit a POST to the
# Terraform scan API endpoint to obtain
# potential security risks for a given ZIP file
# of Terraform files/modules.

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
folder = os.getenv('FOLDER_TERRAFORM')

# Get the sample.zip
os.chdir('../')
path = os.getcwd()

# Load a ZIP file containing Terraform files
zip_folder_path = path + folder

endpoint = "https://api.cloudsploit.com"
path = "/v2/terraforms"
method = "POST"
timestamp = str(int(time.time() * 1000))

# Load the YAML file
with open(zip_folder_path, 'rb') as zip_file:
    zip_base64=base64.b64encode(zip_file.read())

body = {
	"base64": zip_base64.decode(),
	"folder": True
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
