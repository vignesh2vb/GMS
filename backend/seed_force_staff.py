
from app import app, db, User
from werkzeug.security import generate_password_hash

def force_seed_staff():
    with app.app_context():
        print("--- Forcing Staff Account Creation/Reset ---")
        
        staff_data = [
            {"name": "Dr. A. APJ (Faculty)", "regno": "1001", "role": "faculty", "dept": "CSE", "gender": "Male"},
            {"name": "Dr. H. HOD (HOD)", "regno": "1002", "role": "hod", "dept": "CSE", "gender": "Female"},
            {"name": "Dr. P. Principal", "regno": "1003", "role": "principal", "dept": None, "gender": "Male"},
            {"name": "Mr. W. Warden", "regno": "1004", "role": "warden", "dept": None, "gender": "Male", "hostel": "B1"}
        ]

        for s in staff_data:
            user = User.query.filter_by(regno=s['regno']).first()
            if user:
                print(f"Updating existing {s['role']} ({s['regno']})...")
                user.name = s['name']
                user.password = 'pass' # Reset password to 'pass'
                user.role = s['role']
            else:
                print(f"Creating new {s['role']} ({s['regno']})...")
                user = User(
                    name=s['name'], 
                    regno=s['regno'], 
                    password='pass', 
                    role=s['role'], 
                    gender=s['gender'],
                    department=s.get('dept'),
                    hostel_name=s.get('hostel')
                )
                db.session.add(user)
        
        try:
            db.session.commit()
            print("SUCCESS: Staff accounts updated/created.")
        except Exception as e:
            print(f"ERROR: {e}")
            db.session.rollback()

if __name__ == "__main__":
    force_seed_staff()
