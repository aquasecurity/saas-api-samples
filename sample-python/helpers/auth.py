import os
import time
import hmac
import hashlib
from urllib.parse import urlparse

api_key = os.getenv("AQUA_API_KEY")
api_secret = os.getenv("AQUA_API_SECRET")


def headers(url: str, method: str = "GET") -> dict:
    timestamp = str(int(time.time() * 1000))
    path = urlparse(url).path
    string = timestamp + method + path

    secret_bytes = bytes(api_secret, "utf-8")
    string_bytes = bytes(string, "utf-8")

    sig = hmac.new(secret_bytes, msg=string_bytes, digestmod=hashlib.sha256).hexdigest()

    headers = {
        "accept": "application/json",
        "x-api-key": api_key,
        "x-signature": sig,
        "x-timestamp": timestamp,
        "content-type": "application/json",
    }

    return headers
