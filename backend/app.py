from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Grievance
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import os
import time
from werkzeug.utils import secure_filename
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
# Base directory of the application
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Valid Roles
VALID_ROLES = ['student', 'faculty', 'hod', 'principal', 'warden', 'exam_cell', 'office_staff']

# Database Configuration

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'grievance_v3.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
CORS(app)

db.init_app(app)

with app.app_context():
    db.create_all()
    if not User.query.filter_by(regno='aasif').first():
        admin = User(name='Admin', regno='aasif', password='aasif123', role='admin', gender='Male')
        db.session.add(admin)
        db.session.commit()


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    try:
        # Check if user already exists
        if User.query.filter((User.regno == data['regno']) | (User.email == data['email'])).first():
            return jsonify({'error': 'User with this Reg No or Email already exists'}), 400

        new_user = User(
            name=data['name'],
            regno=data['regno'],
            email=data['email'],
            password=data['password'],
            role=data['role'],
            gender=data.get('gender'),
            # Optional fields
            department=data.get('department'),
            year=data.get('year'),
            is_hosteller=data.get('is_hosteller', False),
            hostel_name=data.get('hostel_name'),
            room_number=data.get('room_number')
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Registration successful', 'user': new_user.to_dict()}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    print(f"Login Attempt -> Data: {data}") # Debug Log
    role = data.get('role')
    identifier = data.get('identifier')
    password = data.get('password')

    user = User.query.filter_by(regno=identifier).first()

    if not user:
        print(f"Failed: User with regno '{identifier}' not found.")
        return jsonify({'error': 'User not found'}), 404
    
    print(f"User Found -> ID: {user.id}, Role: {user.role}, Pwd: {user.password}") # Debug Log

    if role == 'student':
        if user.role != 'student':
            return jsonify({'error': f'Current role is {user.role}, not Student'}), 400
        
        # Check password (new registration) OR DOB (legacy/seeded data)
        if user.password != password and user.dob != password:
             return jsonify({'error': 'Invalid Password or DOB'}), 401
    elif role == 'admin':
        if user.role != 'admin':
            print(f"Failed: User role is '{user.role}', expected 'admin'")
            return jsonify({'error': 'Not an admin'}), 403
        if user.password != password:
            print(f"Failed: Password mismatch. Input: '{password}', DB: '{user.password}'")
            return jsonify({'error': 'Invalid password'}), 401
            print(f"Failed: Password mismatch. Input: '{password}', DB: '{user.password}'")
            return jsonify({'error': 'Invalid password'}), 401
    else: # Staff (faculty, hod, warden, principal, exam_cell, office_staff)
        if user.role != role and user.role != 'admin':
             if user.role != role:
                 return jsonify({'error': f'You are registered as a {user.role}, but tried to login as {role}. Please select correct role.'}), 400
        if user.password != password:
            return jsonify({'error': 'Invalid password'}), 401

    print("Login Successful")
    return jsonify({'message': 'Login successful', 'user': user.to_dict()})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Simple whitelist validation
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
    if '.' not in file.filename or \
       file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'File type not allowed'}), 400

    filename = secure_filename(f"{int(time.time())}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # Return URL for the file
    return jsonify({'url': f'/uploads/{filename}'}), 201

# --- Encryption Helper ---

# Load or Generate Key
KEY_FILE = os.path.join(BASE_DIR, 'instance', 'secret.key')
if not os.path.exists(KEY_FILE):
    with open(KEY_FILE, 'wb') as key_file:
        key_file.write(Fernet.generate_key())

with open(KEY_FILE, 'rb') as key_file:
    E_KEY = key_file.read()

cipher = Fernet(E_KEY)

def encrypt_data(text):
    if not text: return None
    return cipher.encrypt(text.encode()).decode()

def decrypt_data(text):
    if not text: return None
    try:
        return cipher.decrypt(text.encode()).decode()
    except:
        return "[Encrypted/Corrupt Data]"

@app.route('/api/admin/add-user', methods=['POST'])
def add_user():
    data = request.json
    try:
        new_user = User(
            name=data['name'],
            regno=data['regno'],
            role=data['role'],
            gender=data.get('gender'),
            dob=data.get('dob'),
            password=data.get('password'),
            year=data.get('year'),
            department=data.get('department'),
            hostel_name=data.get('hostel_name')
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User added successfully', 'user': new_user.to_dict()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'User with this Register Number or Email already exists.'}), 400
    except Exception as e:
        print(f"Error adding user: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:id>', methods=['PUT'])
def edit_user(id):
    data = request.json
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        user.name = data.get('name', user.name)
        user.regno = data.get('regno', user.regno)
        user.role = data.get('role', user.role)
        user.gender = data.get('gender', user.gender)
        user.year = data.get('year', user.year)
        user.department = data.get('department', user.department)
        
        # Handle hosteller updates
        user.is_hosteller = data.get('is_hosteller', user.is_hosteller)
        if user.is_hosteller:
            user.hostel_name = data.get('hostel_name', user.hostel_name)
            user.room_number = data.get('room_number', user.room_number)
        else:
            user.hostel_name = None
            user.room_number = None

        # Only update password/dob if provided and not empty
        if data.get('dob'):
            user.dob = data.get('dob')
        if data.get('password'):
            user.password = data.get('password')

        db.session.commit()
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()})
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        # Optionally delete related grievances if needed, or rely on cascade if configured
        # For now, just deleting user
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

# Grievance Routes
@app.route('/api/grievances/submit', methods=['POST'])
def submit_grievance():
    data = request.json
    try:
        # Validation
        user = User.query.get(data.get('user_id'))
        if user and not user.is_hosteller and data.get('category') == 'hostel':
             return jsonify({'error': 'Day Scholars cannot submit Hostel grievances'}), 403

        # Encrypt Sensitive Data
        enc_description = encrypt_data(data.get('description'))
        enc_attachment = encrypt_data(data.get('attachment_url')) if data.get('attachment_url') else None

        new_grievance = Grievance(
            user_id=data.get('user_id'),
            category=data.get('category'),
            target_role=data.get('target_role'),
            target_staff_id=data.get('target_staff_id') if data.get('target_staff_id') else None,
            description=enc_description, # STORE ENCRYPTED
            attachment_url=enc_attachment, # STORE ENCRYPTED
            is_anonymous=data.get('is_anonymous', False)
        )
        db.session.add(new_grievance)
        db.session.commit()
        return jsonify({'message': 'Grievance submitted successfully'}), 201
    except Exception as e:
        import traceback
        with open("error.log", "a") as f:
            f.write(f"Submit Error: {str(e)}\n{traceback.format_exc()}\n")
        print(f"Submit Error: {e}")
        return jsonify({'error': 'Failed to submit grievance'}), 500


def check_and_escalate_grievances():
    """
    Checks all pending grievances and escalates them based on time.
    Rules:
    1. If Pending/Initial for > 2 days -> Escalate to HOD.
    2. If Pending/HOD for > 5 days -> Escalate to Principal.
    """
    with app.app_context():
        # Get all non-resolved grievances
        pending_grievances = Grievance.query.filter(Grievance.status != 'Resolved').all()
        now = datetime.utcnow()
        
        for g in pending_grievances:
            # Time since last update/creation
            time_at_level = now - g.last_escalated_at
            
            # 1. Initial -> HOD (after 2 days)
            if g.escalation_level == 'Initial' and time_at_level > timedelta(days=2):
                g.escalation_level = 'HOD'
                g.last_escalated_at = now
                print(f"Escalated Grievance {g.id} to HOD")
            # 2. HOD -> Principal (after 5 days at HOD level)
            elif g.escalation_level == 'HOD' and time_at_level > timedelta(days=5):
                g.escalation_level = 'Principal'
                g.last_escalated_at = now
                 # For Warden flow, it technically goes Warden -> Principal directly
                 # Using the same HOD->Principal flow for simplicity as requested, 
                 # interpreting "HOD" as the next level authority.
                print(f"Escalated Grievance {g.id} to Principal")

        db.session.commit()

@app.route('/api/grievances/my', methods=['GET'])
def get_my_grievances():
    check_and_escalate_grievances() 
    user_id = request.args.get('user_id')
    if not user_id: return jsonify({'error': 'User ID required'}), 400
    
    grievances = Grievance.query.filter_by(user_id=user_id).all()
    results = []
    for g in grievances:
        d = g.to_dict()
        d['description'] = decrypt_data(d['description'])
        d['resolution_note'] = decrypt_data(d['resolution_note'])
        d['attachment_url'] = decrypt_data(d['attachment_url'])
        d['response_attachment_url'] = decrypt_data(d['response_attachment_url'])
        results.append(d)
    return jsonify(results)

@app.route('/api/grievances/assigned', methods=['GET'])
def get_assigned_grievances():
    check_and_escalate_grievances()
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Default query (e.g. for faculty): direct assignment or role match
    query = Grievance.query.filter(
        (Grievance.target_staff_id == user_id) | 
        (Grievance.target_role == user.role)
    )

    # Role-based visibility override
    if user.role == 'hod':
         # HOD sees HOD-level, direct assignments, AND Department level items if target_role is missing but escalation is HOD
         # Simplified: Direct + Role + Escalation
         query = Grievance.query.filter(
            (Grievance.target_staff_id == user_id) | 
            (Grievance.target_role == 'hod') |
            (Grievance.escalation_level == 'HOD')
        )
    elif user.role == 'principal':
         query = Grievance.query.filter(
            (Grievance.target_staff_id == user_id) | 
            (Grievance.target_role == 'principal') |
            (Grievance.escalation_level == 'Principal')
        )
    elif user.role == 'warden':
         # Warden sees Hostel complaints + assigned
         query = Grievance.query.filter(
            (Grievance.target_staff_id == user_id) | 
            (Grievance.target_role == 'warden') |
            (Grievance.category == 'hostel') # Wardens see all hostel complaints usually
        )
    elif user.role == 'exam_cell':
         # Exam Cell sees Examination complaints
         query = Grievance.query.filter(
            (Grievance.target_staff_id == user_id) | 
            (Grievance.target_role == 'exam_cell') |
            (Grievance.category == 'examination')
        )
    elif user.role == 'office_staff':
         # Office Staff sees Administrative complaints
         query = Grievance.query.filter(
            (Grievance.target_staff_id == user_id) | 
            (Grievance.target_role == 'office_staff') |
            (Grievance.category == 'administrative')
        )
         
    grievances = query.all()
    
    results = []
    for g in grievances:
        d = g.to_dict()
        try:
            d['description'] = decrypt_data(d['description'])
            d['resolution_note'] = decrypt_data(d['resolution_note'])
            d['attachment_url'] = decrypt_data(d['attachment_url'])
            d['response_attachment_url'] = decrypt_data(d['response_attachment_url'])
        except:
             pass 
        results.append(d)
    return jsonify(results)

@app.route('/api/grievances/all', methods=['GET'])
def get_all_grievances():
    check_and_escalate_grievances()
    
    grievances = Grievance.query.all()
    results = []
    for g in grievances:
        d = g.to_dict()
        d['description'] = decrypt_data(d['description'])
        d['resolution_note'] = decrypt_data(d['resolution_note'])
        d['attachment_url'] = decrypt_data(d['attachment_url'])
        d['response_attachment_url'] = decrypt_data(d['response_attachment_url'])
        results.append(d)
    return jsonify(results)

@app.route('/api/grievances/resolve/<int:id>', methods=['PUT'])
def resolve_grievance(id):
    data = request.json
    status = data.get('status', 'Resolved')
    note = data.get('resolution_note', '')
    resp_attachment = data.get('response_attachment_url', '')
    
    g = Grievance.query.get(id)
    if not g:
        return jsonify({'error': 'Grievance not found'}), 404
        
    g.status = status
    if note:
        g.resolution_note = encrypt_data(note)
    if resp_attachment:
        g.response_attachment_url = encrypt_data(resp_attachment)
        
    db.session.commit()
    return jsonify({'message': 'Status updated and note sent.'})

@app.route('/api/users/staff', methods=['GET'])
def get_staff():
    staff = User.query.filter(User.role.in_(['faculty', 'hod', 'warden', 'principal', 'exam_cell', 'office_staff'])).all()
    return jsonify([s.to_dict() for s in staff])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
