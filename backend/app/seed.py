import requests
import random

API_URL = "http://127.0.0.1:8000/api/incidents"

services = ["payments", "auth", "search", "orders", "notifications"]
severities = ["SEV1", "SEV2", "SEV3", "SEV4"]
statuses = ["OPEN", "MITIGATED", "RESOLVED"]

for i in range(200):
    payload = {
        "title": f"Incident {i}",
        "service": random.choice(services),
        "severity": random.choice(severities),
        "status": random.choice(statuses),
        "owner": None,
        "summary": "Auto-generated incident"
    }

    res = requests.post(API_URL, json=payload)

    if res.status_code != 201:
        print("Failed:", res.status_code, res.text)

print("Seeding complete.")
