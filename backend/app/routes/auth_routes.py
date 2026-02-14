from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.permissions import role_required
from flask_jwt_extended import jwt_required
from app.extensions import db
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth' )

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    # Get the user values
    name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    role = data.get('accountType', 'patient')

    # Validate fields
    if not all([name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if user already exists
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({'error': 'Email already registered'}), 400

    # Hash the password
    hashed = generate_password_hash(password)

    # Create the user
    user = User(name=name, email=email, password=hashed, role=role)
    # create patient profile if role is patient --- IGNORE ---
    if role == 'patient':
        from app.models.patients import Patients
        patient_profile = Patients(user=user)
        db.session.add(patient_profile)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201
# we register doctor from the doctor applications
@auth_bp.route('/register/doctor/<int:doctor_id>', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def register_doctor(doctor_id):
    from app.models.doctorsapplications import DoctorApplication
    application = DoctorApplication.query.get(doctor_id)
    if not application:
        return jsonify({'error': 'Doctor application not found'}), 404
    if application.status == 'approved':
        return jsonify({'error': 'Doctor application already approved'}), 400
    
    # Get the doctor values from application
    name = application.full_name
    speciality_id = application.speciality_id
    experience_years = application.years_of_experience
    email = application.email
    phone = application.phone
    gender = application.gender
    password = request.json.get('password')  # admin sets a temp password for doctor
    
    # Validate fields
    if not all([name, email, password, speciality_id, experience_years]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if user already exists
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({'error': 'Email already registered'}), 400

    # Hash the password
    hashed = generate_password_hash(password)

    # Create the doctor user
    user = User(
        name=name,
        email=email,
        password=hashed,
        role='doctor'
    )
    db.session.add(user)
    db.session.flush()  # to get user.id
    # create doctor profile
    from app.models.doctors import Doctor
    doctor_profile = Doctor(
        user_id=user.id,
        speciality_id=speciality_id,
        experience_years=experience_years,
        consultation_fee=0.0,  # doctor can set later
        status='active'
    )
    db.session.add(doctor_profile)
    # mark application as approved
    application.status = 'approved'
    db.session.commit()

    return jsonify({'message': 'Doctor registered successfully', 'email': application.email, 'password': password}), 201

    
@auth_bp.route('/login/doctor', methods=['POST'])
def login_doctor():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, role='doctor').first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": "doctor"})

    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200
    
@auth_bp.route('/login/patient', methods=['POST'])
def login_patient():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200
 
@auth_bp.route('/register/admin', methods=['POST']) 
def register_admin():
    data = request.json

    # Get the user values
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Validate fields
    if not all([name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if user already exists
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({'error': 'Email already registered'}), 400

    # Hash the password
    hashed = generate_password_hash(password)

    # Create the admin user
    user = User(name=name, email=email, password=hashed, role='admin')
    if user.role == 'admin':
        from app.models.admin import Admin
        admin_profile = Admin(user=user)
        db.session.add(admin_profile)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Admin registered successfully'}), 201
 
@auth_bp.route('/login/admin', methods=['POST'])
def login_admin():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, role='admin').first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": "admin"})


    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200 


    
@auth_bp.route('/logout', methods=['POST'])
def logout():
    # In a real application, you would handle token revocation here.
    return jsonify({"message": "Logout successful"}), 200

#fetch current user info
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()  # string
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200
