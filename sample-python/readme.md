### Aqua SaaS Example - Compliance Status

Simple Python example to collect the latest compliance status for an account for a given compliance program (e.g. GDPR, HIPAA, PCI, etc.)


#### Prerequisites

- Aqua SaaS API key & secret ([API keys](https://cloud.aquasec.com/cspm/#/apikeys))
- Python 3.9+
- Poetry ([install](https://python-poetry.org/docs/#installation))


#### Setup

Install packages.

```
$ poetry install
```

Export environment variables with your Aqua API key and secret.

```
$ export AQUA_API_KEY=abc123d--example--wxyz
$ export AQUA_API_SECRET=STgj--example--YAvtAB5zUOyDEFrwXRkK
```

Change the `key_id` in `main.py` to your key (cloud account/project/subscription).

```python
"""
Replace with your key id
"""
key_id = 999
```

#### Run

```
$ poetry run python main.py

Compliance:  81% / Requirement 1 - Firewalls
Compliance:  80% / Requirement 2 - Defaults
Compliance:  86% / Requirement 3 - Cardholder Data
Compliance: 100% / Requirement 4 - Encrypted Transmission
Compliance:   6% / Requirement 6 - Secure Systems
Compliance:  98% / Requirement 7 - Restrict Access
Compliance:  69% / Requirement 8 - Identify Access
Compliance:  32% / Requirement 10 - Track Access
Compliance: 100% / Requirement 11 - Test Systems
Average for program 1: 72.44%

```