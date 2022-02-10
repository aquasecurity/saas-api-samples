import json
import requests
from .auth import headers

BASE_API_URL = "https://api.cloudsploit.com/v2"


def list_keys() -> list | dict:
    """
    List all cloud accounts (keys)
    """

    url = f"{BASE_API_URL}/keys"
    keys = []

    response = requests.get(url, headers=headers(url))

    if response.status_code == 200:
        data = json.loads(response.text)

        for key in data["data"]:
            keys.append(
                {
                    "id": key["id"],
                    "name": key["name"],
                    "cloud": key["cloud"],
                }
            )

        return keys
    else:
        return {"status": response.status_code}


def latest_scan(key_id: int = None) -> dict:
    """
    Get latest scan id

    Reference: https://cloudsploit.docs.apiary.io/#reference/scans/scans-collection/get-list-all-scans
    """

    if key_id == None:
        url = f"{BASE_API_URL}/scans?limit=1"
    else:
        url = f"{BASE_API_URL}/scans?limit=1&key_id={key_id}"

    response = requests.get(url, headers=headers(url))

    if response.status_code == 200:
        data = json.loads(response.text)
        return data["data"][0]
    else:
        return {"status": response.status_code}


def compliance_report(scan_id: int, program_id: int = 1):
    """
    Get compliance report for a compliance program

    Reference: https://cloudsploit.docs.apiary.io/#reference/compliances/compliances-collection/get-list-all-compliances
    """
    url = f"{BASE_API_URL}/compliances?scan_id={scan_id}&program_id={program_id}&summary=compliance"

    response = requests.get(url, headers=headers(url))

    if response.status_code == 200:
        data = json.loads(response.text)
        return data["data"]
    else:
        return {"status": response.status_code}
