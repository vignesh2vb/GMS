import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000/api"

def print_result(msg, success):
    print(f"[{'PASSED' if success else 'FAILED'}] {msg}")

def run_tests():
    # 1. Register Male Hosteller
    print("\n--- Test 1: Register Male Hosteller ---")
    payload = {
        "role": "student",
        "name": "Test Male",
        "regno": "male_student_v2",
        "email": "male_v2@test.com",
        "password": "pass",
        "gender": "Male",
        "department": "CSE",
        "year": "First",
        "is_hosteller": True,
        "hostel_name": "B1",
        "room_number": "101"
    }
    
    try:
        res = requests.post(f"{BASE_URL}/register", json=payload)
        if res.status_code == 201:
            data = res.json()['user']
            # Verify fields
            if data.get('gender') == 'Male' and data.get('hostel_name') == 'B1' and data.get('is_hosteller') == True:
                print_result("Male Hosteller Registration", True)
            else:
                 print_result(f"Male Hosteller Registration - Fields mismatch: {data}", False)
        else:
            print_result(f"Male Hosteller Registration Failed: {res.text}", False)
    except Exception as e:
        print_result(f"Exception: {e}", False)

    # 2. Register Female Day Scholar (to check negation)
    print("\n--- Test 2: Register Female Day Scholar ---")
    payload_ds = {
        "role": "student",
        "name": "Test Female DS",
        "regno": "female_ds",
        "email": "female_ds@test.com",
        "password": "pass",
        "gender": "Female",
        "department": "IT",
        "year": "Third",
        "is_hosteller": False
    }
    try:
        res = requests.post(f"{BASE_URL}/register", json=payload_ds)
        if res.status_code == 201:
            data = res.json()['user']
            if data.get('is_hosteller') == False and not data.get('hostel_name'):
                print_result("Female Day Scholar Registration", True)
            else:
                print_result(f"Female DS - Unexpected fields: {data}", False)
        else:
            print_result(f"Female DS Registration Failed: {res.text}", False)
    except Exception as e:
        print(e)
    
if __name__ == "__main__":
    run_tests()
