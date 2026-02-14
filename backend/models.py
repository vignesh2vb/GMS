from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    regno = db.Column(db.String(50), unique=True, nullable=True) 
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True) # Added email
    dob = db.Column(db.String(20), nullable=True)  # Format: "YYYY-MM-DD"
    password = db.Column(db.String(100), nullable=True) # For staff/admin
    role = db.Column(db.String(20), nullable=False) # 'admin', 'student', 'faculty', 'hod', 'warden', 'principal'
    gender = db.Column(db.String(10), nullable=True) # 'Male', 'Female', 'Other'

    # New fields
    year = db.Column(db.String(20), nullable=True) # First, Second, Third, Fourth
    department = db.Column(db.String(50), nullable=True) # CSE, MECH, etc.
    hostel_name = db.Column(db.String(50), nullable=True) # B1, G1 for Wardens (and now Students)
    is_hosteller = db.Column(db.Boolean, default=False)
    room_number = db.Column(db.String(10), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'regno': self.regno,
            'name': self.name,
            'role': self.role,
            'gender': self.gender,
            'dob': self.dob,
            'password': self.password,
            'year': self.year,
            'department': self.department,
            'hostel_name': self.hostel_name,
            'is_hosteller': self.is_hosteller,
            'room_number': self.room_number
        }

class Grievance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    category = db.Column(db.String(50), nullable=False)
    target_role = db.Column(db.String(50), nullable=True) 
    target_staff_id = db.Column(db.Integer, nullable=True) 
    
    # ENCRYPTED FIELDS (Stored as TEXT)
    description = db.Column(db.Text, nullable=False)
    resolution_note = db.Column(db.Text, nullable=True)
    
    # ATTACHMENTS (Stored as TEXT - Encrypted URL/Path)
    attachment_url = db.Column(db.Text, nullable=True)
    response_attachment_url = db.Column(db.Text, nullable=True)

    is_anonymous = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='Pending')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Escalation tracking
    escalation_level = db.Column(db.String(20), default='Initial') 
    last_escalated_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='grievances')

    def to_dict(self):
        # Note: Decryption handled in API
        return {
            'id': self.id,
            'category': self.category,
            'target_role': self.target_role,
            'target_staff_id': self.target_staff_id,
            'description': self.description, # Encrypted
            'attachment_url': self.attachment_url, # Encrypted
            'is_anonymous': self.is_anonymous,
            'status': self.status,
            'resolution_note': self.resolution_note, # Encrypted
            'response_attachment_url': self.response_attachment_url, # Encrypted
            'created_at': self.created_at.isoformat(),
            'escalation_level': self.escalation_level,
            'last_escalated_at': self.last_escalated_at.isoformat() if self.last_escalated_at else None,
            'user_name': "Anonymous" if self.is_anonymous else (self.user.name if self.user else "Unknown")
        }
