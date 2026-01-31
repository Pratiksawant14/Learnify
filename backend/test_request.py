import requests
import json

url = "http://localhost:8000/roadmap/generate"
payload = {
    "topic": "Python",
    "level": "Beginner",
    "language": "English",
    "time_commitment": "4 weeks"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
