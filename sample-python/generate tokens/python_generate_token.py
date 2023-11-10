from inspect import signature
from urllib import response
from auth import headers, cwpp_headers
from urllib.request import Request, urlopen
from urllib.parse import urlparse
import json
import ssl
import os
import requests
from requests.utils import DEFAULT_CA_BUNDLE_PATH
import jwt

api_key = os.getenv("AQUA_API_KEY")
api_secret = os.getenv("AQUA_API_SECRET")

print(api_key)
## Prod URL ##
API_URL = "https://api.cloudsploit.com/v2"  

def gen_token():
    ssl._create_default_https_context = ssl._create_unverified_context
    url = f"{API_URL}/tokens"
    # print(url)
    method = 'POST'
    payload = json.dumps({"validity":240,"allowed_endpoints":["ANY"],"csp_roles":["<CHANGE_ME>"]})
    
    request = requests.post(url, data=payload, headers=headers(url,method,payload))
    response_body = json.loads(request.text)
    token = response_body["data"]
    # print(response_body)
    return token
#gen_token()

    
def get_aqua_url(token):
    #### Decode JWT Token for URL ###
    decoded_parse = jwt.decode(token, options={"verify_signature": False})
    # print(decoded_parse)
    aqua_url = decoded_parse["csp_metadata"]["urls"]["ese_url"]
    # print(aqua_url)
    return aqua_url
    
# get_aqua_url(gen_token())  

def check_license():
    ssl._create_default_https_context = ssl._create_unverified_context
    api_version = 'v2'
    api_endpoint = 'api' + '/' + f"{api_version}" + '/'  + 'license'
    token = gen_token()
    # print(token)
    aqua_url = "https://" + get_aqua_url(token)
    print(aqua_url)
    
    endpoint_url = f"{aqua_url}" + '/' + api_endpoint
    # print(endpoint_url)

     
    request = requests.get(endpoint_url, headers=cwpp_headers(token))
    request_response = json.loads(request.text)
    license = json.dumps(request_response, indent = 4, sort_keys = True)
    print(license)
    
check_license()