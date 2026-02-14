
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_admin_login():
    print("Testing Admin Login...")
    
    payload = {
        "identifier": "aasif",
        "password": "aasif123",
        "role": "admin"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: Admin logged in.")
        else:
            print("FAILURE: Admin login failed.")
            
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_admin_login()
