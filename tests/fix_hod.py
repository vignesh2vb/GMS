
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app import app, db, User

def fix_hod_issue():
    with app.app_context():
        print("--- Diagnosing HOD Issue ---")
        
        # 1. Check who owns regno='2'
        user_2 = User.query.filter_by(regno='2').first()
        if user_2:
            print(f"User with regno='2' ALREADY EXISTS:")
            print(f"  Name: {user_2.name}")
            print(f"  Role: {user_2.role}")
            print("  (This explains why you cannot create another user with regno='2')")
        else:
            print("No user found with regno='2'.")

        # 2. Check/Create correct HOD
        hod = User.query.filter_by(role='hod').first()
        if hod:
            print(f"HOD Already Exists: {hod.name} ({hod.regno})")
        else:
            print("Creating HOD with correct regno='1002'...")
            try:
                new_hod = User(name='Dr. H. HOD (HOD)', regno='1002', password='pass', role='hod', department='CSE', gender='Female')
                db.session.add(new_hod)
                db.session.commit()
                print("SUCCESS: HOD created with regno='1002'.")
            except Exception as e:
                print(f"ERROR creating HOD: {e}")

if __name__ == "__main__":
    fix_hod_issue()
