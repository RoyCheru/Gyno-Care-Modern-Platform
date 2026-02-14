from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.appointments import Appointment
from app.models.doctoravailability import DoctorAvailability
from app.models.doctors import Doctor
from app.models.doctorsapplications import DoctorApplication
from app.models.consultation import Consultation
from app.models.user import User
from app.extensions import db
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from app.utils.permissions import role_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/appointments', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_appointments():
    appointments = Appointment.query.all()
    result = [appointment.to_dict() for appointment in appointments]
    return jsonify(result), 200

@admin_bp.route('/doctors/availability', methods=['POST'])
@jwt_required()
@role_required('admin')
def set_doctor_availability():
    data = request.get_json()
    doctor_id = data.get('doctor_id')
    date = data.get('date')
    time_slots = data.get('time_slots')

    if not all([doctor_id, date, time_slots]):
        return jsonify({"msg": "Missing required fields"}), 400

    availability = DoctorAvailability(
        doctor_id=doctor_id,
        date=date,
        time_slots=time_slots
    )
    db.session.add(availability)
    db.session.commit()

    return jsonify({"msg": "Doctor availability set successfully"}), 201   

@admin_bp.route('/consultations', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_all_consultations():
    consultations = Consultation.query.all()
    result = [consultation.to_dict() for consultation in consultations]
    return jsonify(result), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_all_users():
    users = User.query.all()
    result = [user.to_dict() for user in users]
    return jsonify(result), 200


# @admin_bp.route('/users/doctors', methods=['GET'])
# @jwt_required()
# @role_required(['admin'])
# def get_all_doctors():
#     doctors = User.query.filter_by(role='doctor').all()
#     result = [doctor.to_dict() for doctor in doctors]
#     return jsonify(result), 200

# ============================
# get all doctors
# ============================
@admin_bp.route('/users/doctors', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_all_doctors():
    doctors = Doctor.query.all()
    result = [doctor.to_dict() for doctor in doctors]
    return jsonify(result), 200

@admin_bp.route('/patients/all', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_all_patients():
    from app.models.patients import Patients
    patients = Patients.query.all()
    result = [patient.to_dict() for patient in patients]
    return jsonify(result), 200

@admin_bp.route('/users/doctors/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_doctor_details(user_id):
    doctor = User.query.filter_by(id=user_id, role='doctor').first()
    if not doctor:
        return jsonify({"msg": "Doctor not found"}), 404
    return jsonify(doctor.to_dict()), 200


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted successfully"}), 200

@admin_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"msg": "Appointment not found"}), 404

    db.session.delete(appointment)
    db.session.commit()
    return jsonify({"msg": "Appointment deleted successfully"}), 200


@admin_bp.route('/consultations/<int:consultation_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_consultation(consultation_id):
    consultation = Consultation.query.get(consultation_id)
    if not consultation:
        return jsonify({"msg": "Consultation not found"}), 404

    db.session.delete(consultation)
    db.session.commit()
    return jsonify({"msg": "Consultation deleted successfully"}), 200


@admin_bp.route('/doctors/availability/<int:availability_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_doctor_availability(availability_id):
    availability = DoctorAvailability.query.get(availability_id)
    if not availability:
        return jsonify({"msg": "Doctor availability not found"}), 404

    db.session.delete(availability)
    db.session.commit()
    return jsonify({"msg": "Doctor availability deleted successfully"}), 200


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_system_stats():
    total_users = User.query.count()
    total_appointments = Appointment.query.count()
    total_consultations = Consultation.query.count()

    stats = {
        "total_users": total_users,
        "total_appointments": total_appointments,
        "total_consultations": total_consultations
    }
    return jsonify(stats), 200

#approve or reject doctor applications
@admin_bp.route('/doctors/applications/approve/<int:application_id>', methods=['POST'])
@jwt_required()
@role_required(["admin"])
def review_doctor_application(application_id):
    application = DoctorApplication.query.get(application_id)
    if not application:
        return jsonify({"msg": "Application not found"}), 404
    if application.status != 'pending':
        return jsonify({"msg": "Application already reviewed"}), 400
    
    # Generate temp password
    temp_password = "doc12345"  # In real scenario, generate a secure random password and email it to the doctor. Also you can use random generation libraries.
    hashed_password = generate_password_hash(temp_password)
    # Create user account (doctor will later set password via email link)
    new_user = User(
        name=application.full_name,
        email=application.email,
        role="doctor",
        password=hashed_password   # doctor will set password later
    )

    db.session.add(new_user)
    db.session.flush()  # get new_user.id

    # Create doctor profile
    new_doctor = Doctor(
        user_id=new_user.id,
        speciality_id=application.speciality_id,
        experience_years=application.years_of_experience,
        medicalLicenceNumber=application.medicalLicenceNumber,
        phone=application.phone,
        consultation_fee=0.0,  # doctor can set later
        status="active",
        location=application.location
    )

    db.session.add(new_doctor)

    # approve application instead of deleting for record keeping
    application.status = 'approved'
    db.session.commit()

    return jsonify({
        "message": "Doctor approved successfully",
        "doctor": new_doctor.to_dict()
    }), 201

@admin_bp.route('/doctors/applications/reject/<int:application_id>', methods=['POST'])
@jwt_required()
@role_required(["admin"])
def reject_doctor_application(application_id):
    application = DoctorApplication.query.get(application_id)
    if not application:
        return jsonify({"msg": "Application not found"}), 404
    if application.status != 'pending':
        return jsonify({"msg": "Application already reviewed"}), 400

    # we delete the application or mark as rejected
    application.status = 'rejected'
    db.session.commit()

    return jsonify({"message": "Doctor application rejected successfully"}), 200


@admin_bp.route('/doctors/applications', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_doctor_applications():
    applications = DoctorApplication.query.filter_by(status='pending').all()
    result = [app.to_dict() for app in applications]
    return jsonify(result), 200

@admin_bp.route('/patients/total', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_total_patients():
    total_patients = User.query.filter_by(role='patient').count()
    return jsonify({'total_patients': total_patients}), 200

@admin_bp.route('/doctors/total', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_total_doctors():
    total_doctors = User.query.filter_by(role='doctor').count()
    return jsonify({'total_doctors': total_doctors}), 200

# ============================
#  pending doctors applications count
# ============================
@admin_bp.route('/doctors/applications/pending', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_pending_doctor_applications_count():
    pending_count = DoctorApplication.query.filter_by(status='pending').count()
    return jsonify({'pending_applications': pending_count}), 200

# ============================
# appointments count this month
# ============================
@admin_bp.route('/appointments/this_month', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_appointments_this_month_count():
    from datetime import datetime
    from sqlalchemy import extract

    now = datetime.now()
    month = now.month
    year = now.year

    count = Appointment.query.filter(
        extract('month', Appointment.date) == month,
        extract('year', Appointment.date) == year
    ).count()

    return jsonify({'appointments_this_month': count}), 200
