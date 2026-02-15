import requests

BASE_URL = "http://localhost:5000/api"

def test_login(identifier, password, role):
    print(f"Testing Login: {identifier} as {role}")
    res = requests.post(f"{BASE_URL}/login", json={
        "identifier": identifier,
        "password": password,
        "role": role
    })
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}\n")

if __name__ == "__main__":
    # Test cases based on seeded data
    test_login("1001", "pass", "faculty")
    test_login("1002", "pass", "hod")
    test_login("1003", "pass", "principal")
    test_login("1004", "pass", "warden")
    
    # Negative test
    test_login("1001", "wrongpass", "faculty")
    test_login("1001", "pass", "student") # Wrong role
