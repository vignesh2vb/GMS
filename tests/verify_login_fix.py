
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def verify_new_admin_login():
    print("Testing New Admin Login (username: admin)...")
    
    payload = {
        "identifier": "admin",
        "password": "admin",
        "role": "admin"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: New Admin logged in.")
        else:
            print("FAILURE: New Admin login failed.")
            
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    verify_new_admin_login()
