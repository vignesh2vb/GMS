
from app import app, db, User

def inspect_users():
    with app.app_context():
        users = User.query.all()
        print(f"Found {len(users)} users.")
        for u in users:
            print(f"ID: {u.id} | Name: {u.name} | Regno: {u.regno} | Role: {u.role} | Pwd: {u.password}")

if __name__ == "__main__":
    inspect_users()
