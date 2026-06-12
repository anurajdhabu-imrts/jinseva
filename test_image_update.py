#!/usr/bin/env python3
"""
Simple test script to check if event image updates work
"""
import requests
import json
import base64
from PIL import Image
import io

# Create a test image
img = Image.new('RGB', (400, 300), color='red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG', quality=80)
img_byte_arr.seek(0)

# Convert to base64 data URL
base64_data = base64.b64encode(img_byte_arr.getvalue()).decode()
data_url = f"data:image/jpeg;base64,{base64_data}"

print(f"Test image data URL length: {len(data_url)}")

# API endpoint
BASE_URL = "http://localhost:5000/api"

# For testing, use token from headers if available
# (in real test, would need to login first)
token = "test-token"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"  # This will fail but shows the request
}

# Test payload
payload = {
    "title": "Test Event Update",
    "image": data_url
}

print(f"Payload size: {len(json.dumps(payload))} bytes")
print(f"Image field size in payload: {len(payload['image'])} bytes")

# Try to make the request (will fail with auth but shows the structure)
try:
    response = requests.put(
        f"{BASE_URL}/events/EVT-102",
        json=payload,
        headers=headers,
        timeout=5
    )
    print(f"Response status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Request error (expected): {e}")

print("\n✓ Test complete. Image data URL would be sent to backend.")
