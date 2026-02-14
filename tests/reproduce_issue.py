
import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

def test_add_user():
    print("Testing Add User Endpoint...")
    regno = f"TEST_{int(time.time())}"
    
    # Payload simulating an HOD adding a student
    payload = {
        "name": "Test Student",
        "regno": regno,
        "role": "student",
        "dob": "2000-01-01",
        "gender": "Male",
        "year": "First",
        "department": "CSE",
        "is_hosteller": False
    }
    
    try:
        # First attempt - Success
        response = requests.post(f"{BASE_URL}/api/admin/add-user", json=payload)
        print(f"Attempt 1 Status: {response.status_code}")
        print(f"Attempt 1 Response: {response.text}")
        
        # Second attempt - Failure (Duplicate)
        response = requests.post(f"{BASE_URL}/api/admin/add-user", json=payload)
        print(f"Attempt 2 Status (Expected 500/Error): {response.status_code}")
        print(f"Attempt 2 Response: {response.text}")

            
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_add_user()
