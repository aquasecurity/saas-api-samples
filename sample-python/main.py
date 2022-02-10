import json
from helpers.aqua import list_keys
from helpers.aqua import latest_scan
from helpers.aqua import compliance_report

"""
Compliance program IDs
  1     # PCI
  2     # HIPAA
  221   # SOC 2 type II
  268   # ISO 27001
  ...
"""
program_id = 1


"""
Uncomment to get a list of all cloud accounts/projects/subscriptions (a/k/a "keys")
"""
# keys = list_keys()
# print(json.dumps(keys, indent=2))

"""
Replace with your key id
"""
key_id = 999


"""
get latest scan
"""
scan = latest_scan(key_id=key_id)


"""
get a compliance report
"""
report = compliance_report(scan_id=scan["id"], program_id=program_id)

if len(report) > 0:
    statuses = []

    for result in report:
        statuses.append(result["compliance"])
        s = str(result["compliance"]).rjust(3, " ")
        print(f"Compliance: {s}% / {result['name']}")
        # uncomment to print full report details
        # print(json.dumps(report, indent=2))

    avg = "{:.2f}".format(sum(statuses) / len(report))
    print(f"Average for program {program_id}: {avg}%")
else:
    print(f"No results for compliance program {program_id}.")
