
from app import app, db, User

def diagnose_update_conflict():
    with app.app_context():
        print(f"\n{'='*20} DIAGNOSING UPDATE ERROR {'='*20}")
        
        # 1. Who is User 15?
        u15 = User.query.get(15)
        if u15:
            print(f"User ID 15 found:")
            print(f"  Current Name: {u15.name}")
            print(f"  Current RegNo: {u15.regno}")
            print(f"  Current Role: {u15.role}")
        else:
            print("User ID 15 NOT FOUND.")

        # 2. Who owns regno='2'?
        u2 = User.query.filter_by(regno='2').first()
        if u2:
            print(f"\nConflict: User with regno='2' ALREADY EXISTS:")
            print(f"  ID: {u2.id}")
            print(f"  Name: {u2.name}")
            print(f"  Role: {u2.role}")
            
            if u15 and u15.id == u2.id:
                 print("\nWait.. User 15 IS User 2. Update should work unless unique constraint is broken elsewhere (e.g. email?)")
            else:
                 print(f"\nCONCLUSION: You are trying to change User 15's regno to '2', but '2' is already taken by User {u2.id} ({u2.name}).")
        else:
            print("\nNo user found with regno='2'. Update should theoretically work.")

if __name__ == "__main__":
    diagnose_update_conflict()
