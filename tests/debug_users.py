from app import app, db, User

with app.app_context():
    users = User.query.all()
    print("-" * 50)
    print(f"{'Name':<20} | {'Role':<15} | {'RegNo':<10} | {'Password':<15}")
    print("-" * 65)
    for u in users:
        print(f"{u.name:<20} | {u.role:<15} | {u.regno:<10} | {u.password:<15}")
    print("-" * 50)
