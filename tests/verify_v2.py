import requests
import sys

BASE_URL = "http://127.0.0.1:5000/api"

def test_backend():
    print("Testing Backend API v2 (Gamified)...")
    
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

    # 1.5. List Users (New Feature)
    print("\n1.5. List Users")
    res = requests.get(f"{BASE_URL}/admin/users")
    if res.status_code == 200:
        users = res.json()
        print(f"Users Found: {len(users)}")
    else:
        print(f"List Users Failed: {res.text}")
    
    # 2. Add Student
    print("\n2. Add Student (S202)")
    res = requests.post(f"{BASE_URL}/admin/add-user", json={
        "name": "Gamer Student",
        "regno": "S202",
        "dob": "2000-01-01",
        "role": "student"
    })
    if res.status_code == 200 or "UNIQUE constraint failed" in res.text:
         print("Add Student Success")
    else:
        print(f"Add Student Failed: {res.text}")

    # 3. Add Faculty
    print("\n3. Add Faculty (F202)")
    res = requests.post(f"{BASE_URL}/admin/add-user", json={
        "name": "Gamer Faculty",
        "regno": "F202",
        "password": "pass",
        "role": "faculty"
    })
    if res.status_code == 200 or "UNIQUE constraint failed" in res.text:
        print("Add Faculty Success")
        # Ensure we get the ID for this faculty to test targeting
        all_users = requests.get(f"{BASE_URL}/admin/users").json()
        faculty_user = next((u for u in all_users if u['regno'] == 'F202'), None)
        f_id = faculty_user['id'] if faculty_user else None
    else:
        print(f"Add Faculty Failed: {res.text}")
        sys.exit(1)

    # 4. Login as Student
    print("\n4. Login as Student (S202)")
    res = requests.post(f"{BASE_URL}/login", json={
        "role": "student",
        "identifier": "S202",
        "password": "2000-01-01"
    })
    if res.status_code == 200:
        student_data = res.json()['user']
        print(f"Student Login Success: ID={student_data['id']}")
    else:
        print(f"Student Login Failed: {res.text}")
        sys.exit(1)

    # 5. Submit Grievance Targeted at Faculty
    print("\n5. Submit Targeted Grievance")
    grievance = {
        "user_id": student_data['id'],
        "category": "academic",
        "target_staff_id": f_id,
        "description": "Level 1 Boss is too hard (Targeted Grievance)",
        "is_anonymous": False
    }
    res = requests.post(f"{BASE_URL}/grievances/submit", json=grievance)
    if res.status_code == 200:
        print("Grievance Submitted")
    else:
        print(f"Submit Grievance Failed: {res.text}")
        sys.exit(1)

    # 6. Fetch Grievances (Student)
    print("\n6. Fetch Grievances")
    res = requests.get(f"{BASE_URL}/grievances/my?user_id={student_data['id']}")
    grievances = res.json()
    if len(grievances) > 0:
        g_id = grievances[-1]['id'] # Get latest
        print(f"Grievance Found: ID={g_id}")
    else:
        print("No grievances found!")
        sys.exit(1)

    # 7. Resolve with Note
    print(f"\n7. Resolve Grievance ID={g_id} with Note")
    res = requests.put(f"{BASE_URL}/grievances/resolve/{g_id}", json={
        "status": "Resolved",
        "resolution_note": "Git gud. (Resolution Note)"
    })
    if res.status_code == 200:
        print("Grievance Resolved with Note")
    else:
        print(f"Resolve Failed: {res.text}")
        sys.exit(1)

    # 8. Verify Note
    print("\n8. Verify Note (Student)")
    res = requests.get(f"{BASE_URL}/grievances/my?user_id={student_data['id']}")
    grievances = res.json()
    latest = grievances[-1]
    if latest['status'] == 'Resolved' and latest['resolution_note'] == "Git gud. (Resolution Note)":
        print("Content Verified: Status Resolved & Note Matches")
    else:
        print(f"Verification Failed: {latest}")

if __name__ == "__main__":
    try:
        test_backend()
    except Exception as e:
        print(f"Script Error: {e}")
        sys.exit(1)
