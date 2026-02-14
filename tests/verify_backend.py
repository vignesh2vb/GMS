import requests
import sys

BASE_URL = "http://127.0.0.1:5000/api"

def test_backend():
    print("Testing Backend API...")
    
    # 1. Login as Admin
    print("\n1. Login as Admin")
    res = requests.post(f"{BASE_URL}/login", json={
        "role": "admin",
        "identifier": "aasif",
        "password": "aasif123"
    })
    if res.status_code == 200:
        print("Admin Login Success")
    else:
        print(f"Admin Login Failed: {res.text}")
        sys.exit(1)

    # 2. Add Student
    print("\n2. Add Student (S101)")
    res = requests.post(f"{BASE_URL}/admin/add-user", json={
        "name": "Test Student",
        "regno": "S101",
        "dob": "2000-01-01",
        "role": "student"
    })
    if res.status_code == 201 or res.status_code == 200 or "UNIQUE constraint failed" in res.text:
         print("Add Student Success (or already exists)")
    else:
        print(f"Add Student Failed: {res.text}")
        sys.exit(1)

    # 3. Login as Student
    print("\n3. Login as Student (S101)")
    res = requests.post(f"{BASE_URL}/login", json={
        "role": "student",
        "identifier": "S101",
        "password": "2000-01-01" # DOB
    })
    if res.status_code == 200:
        student_data = res.json()['user']
        print(f"Student Login Success: ID={student_data['id']}")
    else:
        print(f"Student Login Failed: {res.text}")
        sys.exit(1)

    # 4. Submit Grievance
    print("\n4. Submit Grievance")
    grievance = {
        "user_id": student_data['id'],
        "category": "academic",
        "description": "Test grievance from script",
        "is_anonymous": False
    }
    res = requests.post(f"{BASE_URL}/grievances/submit", json=grievance)
    if res.status_code == 201 or res.status_code == 200:
        print("Grievance Submitted")
    else:
        print(f"Submit Grievance Failed: {res.text}")
        sys.exit(1)

    # 5. Fetch Grievances (Student view)
    print("\n5. Fetch Grievances (Student)")
    res = requests.get(f"{BASE_URL}/grievances/my?user_id={student_data['id']}")
    grievances = res.json()
    if len(grievances) > 0:
        print(f"Grievances Found: {len(grievances)}")
        g_id = grievances[0]['id']
    else:
        print("No grievances found!")
        sys.exit(1)

    # 6. Add Faculty
    print("\n6. Add Faculty (F101)")
    res = requests.post(f"{BASE_URL}/admin/add-user", json={ # Ignore result if exists
        "name": "Test Faculty",
        "regno": "F101",
        "password": "password123", # Password
        "role": "faculty"
    })
    
    if res.status_code == 200 or res.status_code == 201 or "UNIQUE constraint failed" in res.text:
        # We don't exit here if it fails because it might already exist
        pass

    # 7. Login Faculty
    print("\n7. Login Faculty (F101)")
    res = requests.post(f"{BASE_URL}/login", json={
        "role": "faculty",
        "identifier": "F101",
        "password": "password123"
    })
    if res.status_code == 200:
        faculty_data = res.json()['user']
        print("Faculty Login Success")
    else:
        print(f"Faculty Login Failed: {res.text}")
        sys.exit(1)

    # 8. Resolve Grievance
    print(f"\n8. Resolve Grievance ID={g_id}")
    res = requests.put(f"{BASE_URL}/grievances/resolve/{g_id}", json={"status": "Resolved"})
    if res.status_code == 200:
        print("Grievance Resolved")
    else:
        print(f"Resolve Failed: {res.text}")
        sys.exit(1)

    # 9. Verify Resolved Status
    print("\n9. Verify Status (Student)")
    res = requests.get(f"{BASE_URL}/grievances/my?user_id={student_data['id']}")
    grievances = res.json()
    if grievances[0]['status'] == 'Resolved':
        print("Status is Resolved")
    else:
        print(f"Status Update Failed: {grievances[0]['status']}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        test_backend()
    except Exception as e:
        print(f"Script Error: {e}")
        sys.exit(1)
