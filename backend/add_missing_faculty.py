from app import app, db, User
from sqlalchemy.exc import IntegrityError

with app.app_context():
    # Check if 1001 exists
    if not User.query.filter_by(regno='1001').first():
        try:
            faculty = User(name='Dr. A. APJ (Faculty)', regno='1001', password='pass', role='faculty', department='CSE', gender='Male')
            db.session.add(faculty)
            db.session.commit()
            print("Added Faculty (1001/pass)")
        except IntegrityError:
            db.session.rollback()
            print("Faculty 1001 already exists or conflict.")
    else:
        print("Faculty 1001 already exists.")
