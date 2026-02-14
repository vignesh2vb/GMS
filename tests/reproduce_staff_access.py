
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_staff_access():
    print("Testing Staff Access (Login + Dashboard Data)...")
    
    staff_credentials = [
        {"id": "1001", "role": "faculty", "name": "Faculty"},
        {"id": "1002", "role": "hod", "name": "HOD"},
        {"id": "1003", "role": "principal", "name": "Principal"},
        {"id": "1004", "role": "warden", "name": "Warden"}
    ]

    for staff in staff_credentials:
        print(f"\n--- Testing {staff['name']} ({staff['role']}) ---")
        
        # 1. Login
        payload = {
            "identifier": staff["id"],
            "password": "pass",
            "role": staff["role"]
        }
        
        try:
            res = requests.post(f"{BASE_URL}/api/login", json=payload)
            if res.status_code == 200:
                user = res.json().get('user')
                print(f"[OK] Login Success: {user['name']}")
                
                # 2. Fetch Grievances (Simulate Dashboard Load)
                # Staff fetching "Assigned" grievances
                print(f"    Fetching Assigned Grievances (user_id={user['id']})...")
                res_dash = requests.get(f"{BASE_URL}/api/grievances/assigned?user_id={user['id']}")
                
                if res_dash.status_code == 200:
                     print(f"    [OK] Dashboard Data Loaded: {len(res_dash.json())} grievances")
                else:
                     print(f"    [FAIL] Fetch Dashboard Failed: {res_dash.status_code} - {res_dash.text}")
                     
            else:
                print(f"[FAIL] Login Failed: {res.status_code} - {res.text}")
                
        except Exception as e:
            print(f"[ERROR] Exception: {e}")

if __name__ == "__main__":
    test_staff_access()
