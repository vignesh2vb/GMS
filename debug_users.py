import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from backend.app import app, db, User

with app.app_context():
    users = User.query.all()
    print(f"{'ID':<5} {'Name':<30} {'RegNo':<15} {'Role':<10}")
    print("-" * 60)
    for u in users:
        print(f"{u.id:<5} {u.name:<30} {u.regno:<15} {u.role:<10}")
