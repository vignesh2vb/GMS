
from app import app, db, User

def add_admin_user():
    with app.app_context():
        if not User.query.filter_by(regno='admin').first():
            admin = User(name='Administrator', regno='admin', password='admin', role='admin', gender='Male')
            db.session.add(admin)
            db.session.commit()
            print("Added user 'admin' with password 'admin'")
        else:
            print("User 'admin' already exists")

if __name__ == "__main__":
    add_admin_user()
