
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_hod_update_user():
    print("Testing HOD Update User...")
    
    # 1. Login as Admin to ensure we have a student to update (or just use known ID)
    # Let's assume we want to update the student with regno 'test1234' (ID 10 from previous debug) or just create one.
    
    # Create a target student first to be sure
    student_payload = {
        "name": "Update Target",
        "regno": "UPDATE_TARGET",
        "role": "student",
        "dob": "2000-01-01", 
        "gender": "Male",
        "year": "First",
        "department": "CSE",
        "is_hosteller": False
    }
    requests.post(f"{BASE_URL}/api/admin/add-user", json=student_payload)
    
    # Get the user to find ID
    res = requests.get(f"{BASE_URL}/api/admin/users")
    users = res.json()
    target_user = next((u for u in users if u['regno'] == 'UPDATE_TARGET'), None)
    
    if not target_user:
        print("Setup Failed: Could not create target user.")
        return

    print(f"Target User ID: {target_user['id']}")

    # 2. Update the user (Simulating HOD action - backend doesn't distinguish session yet, just endpoint)
    update_payload = {
        "name": "Update Target Modified",
        "regno": "UPDATE_TARGET", # Keeping same unique field
        "role": "student",
        "year": "Second", # Changing year
        "department": "CSE"
    }
    
    try:
        response = requests.put(f"{BASE_URL}/api/admin/users/{target_user['id']}", json=update_payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_hod_update_user()
