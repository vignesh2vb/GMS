from app import app, db, User

with app.app_context():
    # Check if Faculty exists
    if not User.query.filter_by(role='faculty').first():
        faculty = User(name='Dr. A. APJ (Faculty)', regno='1001', password='pass', role='faculty', department='CSE', gender='Male')
        db.session.add(faculty)
        print("Added Faculty (1001/pass)")

    # Check if HOD exists
    if not User.query.filter_by(role='hod').first():
        hod = User(name='Dr. H. HOD (HOD)', regno='1002', password='pass', role='hod', department='CSE', gender='Female')
        db.session.add(hod)
        print("Added HOD (1002/pass)")

    # Check if Principal exists
    if not User.query.filter_by(role='principal').first():
        principal = User(name='Dr. P. Principal', regno='1003', password='pass', role='principal', gender='Male')
        db.session.add(principal)
        print("Added Principal (1003/pass)")
    
    # Check if Warden exists
    if not User.query.filter_by(role='warden').first():
        warden = User(name='Mr. W. Warden', regno='1004', password='pass', role='warden', gender='Male', hostel_name='B1')
        db.session.add(warden)
        print("Added Warden (1004/pass)")

    db.session.commit()
