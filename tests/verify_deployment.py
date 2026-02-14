import requests
import time

BASE_URL = "http://127.0.0.1:5000"

def test_backend():
    print("Testing Backend Endpoints...")
    
    # 1. Register
    reg_data = {
        "name": "Test Student",
        "email": "test@example.com",
        "regno": "test1234",
        "password": "password123",
        "role": "student",
        "gender": "Male",
        "department": "CSE",
        "year": "Third",
        "is_hosteller": True,
        "hostel_name": "B1",
        "room_number": "100"
    }
    
    try:
        print(f"Attempting to register user: {reg_data['regno']}")
        res = requests.post(f"{BASE_URL}/api/register", json=reg_data)
        if res.status_code == 201:
            print("[OK] Registration Successful")
        elif res.status_code == 400 and "already exists" in res.text:
            print("[OK] User already exists (Expected on re-run)")
        else:
            print(f"[FAIL] Registration Failed: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"[FAIL] Connection Failed: {e}")
        return

    # 2. Login
    login_data = {
        "identifier": "test1234",
        "password": "password123",
        "role": "student"
    }
    
    try:
        print(f"Attempting to login user: {login_data['identifier']}")
        res = requests.post(f"{BASE_URL}/api/login", json=login_data)
        if res.status_code == 200:
            print("[OK] Login Successful")
            token = res.json().get('user')
            print(f"   User: {token['name']}")
        else:
            print(f"[FAIL] Login Failed: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"[FAIL] Connection Failed: {e}")


    # 3. Update User (New Test)
    update_data = {
        "name": "Test Student Updated",
        "year": "Fourth"
    }
    
    try:
        # We need the ID. Since we don't have a list users endpoint in this script, we'll rely on login response having ID if available, 
        # or we skip this if we can't get ID easily.
        # But wait, login response has 'user' object with ID.
        if 'token' in locals() and token:
             user_id = token['id']
             print(f"Attempting to update user ID: {user_id}")
             res = requests.put(f"{BASE_URL}/api/admin/users/{user_id}", json=update_data)
             if res.status_code == 200:
                 print("[OK] User Update Successful")
             else:
                 print(f"[FAIL] User Update Failed: {res.status_code} - {res.text}")
        else:
             print("[SKIP] Skipping Update: No user ID available from login")

    except Exception as e:
        print(f"[FAIL] Connection Failed during Update: {e}")

if __name__ == "__main__":
    # Wait a bit for server to be ready if called immediately after start
    time.sleep(2)
    test_backend()
