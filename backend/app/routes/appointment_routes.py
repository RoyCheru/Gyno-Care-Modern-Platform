from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.appointments import Appointment
from app.models.doctors import Doctor
from datetime import datetime
from app.models.doctoravailability import DoctorAvailability
from app.models.consultation import Consultation
from app.models.user import User
from app.extensions import db
from app.utils.permissions import role_required

appointment_bp = Blueprint("appointment_bp", __name__, url_prefix="/api/appointments")

@appointment_bp.route("/book", methods=["POST", "OPTIONS"])
@jwt_required()
@role_required(["patient"])
def book_appointment():
    if request.method == "OPTIONS":
        return '', 200
    data = request.get_json() or {}
    patient_id = get_jwt_identity()["id"]

    doctor_id = data.get("doctor_id")
    date_str = data.get("date")
    slot_str = data.get("slot")
    reason = data.get("reason")

    if not all([doctor_id, slot_str, reason]):
        return jsonify({"error": "Missing required fields"}), 400
    

    # Validate doctor
    doctor = Doctor.query.filter_by(id=doctor_id, status="active").first()
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404


    # Combine date + slot → datetime
    try:
        appointment_time = datetime.strptime(
            f"{date_str} {slot_str}",
            "%Y-%m-%d %H:%M"
        )
    except ValueError:
        return jsonify({"error": "Invalid date or time format"}), 400
    
    # Check if slot already booked

    existing = Appointment.query.filter_by(
        doctor_id=doctor_id,
        appointment_time=appointment_time
    ).first()
    
    if existing:
        return jsonify({"error": "Time slot already booked"}), 409
    
    # Create appointment
    new_appointment = Appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        reason=reason,
        appointment_time=appointment_time,
        status="pending"   # recommended status
    )
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({"message": "Appointment booked successfully", "appointment": new_appointment.to_dict()}), 201



# ============================
#  PATIENT: View own appointments
# ============================

@appointment_bp.route("/mybookings", methods=["GET"])
@jwt_required()
@role_required(["patient"])
def patient_appointments():
    patient_id = get_jwt_identity()["id"]
    appointments = Appointment.query.filter_by(patient_id=patient_id).all()

    return jsonify([a.to_dict() for a in appointments]), 200


# ============================
# Patient: Cancel appointment
# ============================

@appointment_bp.route("/cancel/<int:appointment_id>", methods=["PUT"])
@jwt_required()
@role_required("patient")
def cancel_appointment(appointment_id):
    patient_id = get_jwt_identity()

    appointment = Appointment.query.get_or_404(appointment_id)

    if appointment.patient_id != patient_id:
        return jsonify({"msg": "Not your appointment"}), 403

    if appointment.status != "pending":
        return jsonify({"msg": "Only pending appointments can be cancelled"}), 400
    
    appointment.status = "cancelled"
    db.session.commit()

    return jsonify({"msg": "Appointment cancelled successfully"})

# viewing available slots for booking
@appointment_bp.route("/doctor/<int:doctor_id>/available_slots", methods=["GET"])
@jwt_required()
@role_required(["patient"])
def view_available_slots(doctor_id):
    date_str = request.args.get("date")
    if not date_str:
        return jsonify({"msg": "date query parameter is required"}), 400
    appointment_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    weekday = appointment_date.strftime("%A")
    
    slots = DoctorAvailability.query.filter_by(doctor_id=doctor_id, day_of_week=weekday).all()
    
    if not slots:
        return jsonify({"msg": "No availability found for the given date"}), 404
    
    # Get all existing appointments for that date
    existing_appointments = Appointment.query.filter_by(doctor_id=doctor_id, appointment_date=appointment_date).all()
    
    booked_times = [
        a.time.strftime("%H:%M") for a in existing_appointments
    ]
    
    # Build available slots
    available_slots = []
    for slot in slots:
        # assuming slots are in 30-minute intervals
        start_time = datetime.combine(appointment_date, slot.start_time)
        end_time = datetime.combine(appointment_date, slot.end_time)
        
        while start_time <= end_time:
            time_str = start_time.strftime("%H:%M")
            if time_str not in booked_times:
                available_slots.append({
                    "day_of_week": slot.day_of_week,
                    "start_time": slot.start_time.strftime("%H:%M"),
                    "end_time": slot.end_time.strftime("%H:%M"),
                    "available_time": time_str
                })
            start_time += timedelta(minutes=30)
    
    return jsonify({
        "date": date_str,
        "available_slots": available_slots
    }), 200

# ============================
#  DOCTOR: View assigned appointments
# ============================

@appointment_bp.route("/doctor", methods=["GET"])
@jwt_required()
@role_required(["doctor"])
def doctor_appointments():
    doctor_id = get_jwt_identity()
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()

    return jsonify([a.to_dict() for a in appointments]), 200



# ============================
#  ADMIN: View all appointments
# ============================

@appointment_bp.route("/all", methods=["GET"])
@jwt_required()
@role_required(["admin"])
def all_appointments():
    appointments = Appointment.query.all()
    return jsonify([a.to_dict() for a in appointments]), 200



# ============================
#  ADMIN: Delete appointment
# ============================

@appointment_bp.route("/delete/<int:appointment_id>", methods=["DELETE"])
@jwt_required()
@role_required(["admin"])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)

    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    db.session.delete(appointment)
    db.session.commit()

    return jsonify({"message": "Appointment deleted"}), 200


# 1. START VIRTUAL CONSULTATION
# ==========================================================
@appointment_bp.route("/<int:appointment_id>/start/virtual", methods=["PUT"])
@jwt_required()
@role_required(["doctor"])
def start_virtual(appointment_id):
    doctor_id = get_jwt_identity()
    appointment = Appointment.query.get_or_404(appointment_id)

    # Doctor ownership check
    if appointment.doctor_id != doctor_id:
        return jsonify({"error": "Unauthorized"}), 403

    if appointment.status != "approved":
        return jsonify({"error": f"Cannot start consultation at status '{appointment.status}'"}), 400

    appointment.status = "in_progress"

    # Create consultation record
    consultation = Consultation(
        appointment_id=appointment.id,
        doctor_id=doctor_id,
        patient_id=appointment.patient_id
    )
    db.session.add(consultation)
    db.session.commit()

    return jsonify({
        "message": "Virtual consultation started",
        "appointment": appointment.to_dict(),
        "consultation": consultation.to_dict()
    }), 200


# ==========================================================
# 2. START PHYSICAL CONSULTATION
# ==========================================================
@appointment_bp.route("/<int:appointment_id>/start/physical", methods=["PUT"])
@jwt_required()
@role_required(["doctor"])
def start_physical(appointment_id):
    doctor_id = get_jwt_identity()
    appointment = Appointment.query.get_or_404(appointment_id)

    if appointment.doctor_id != doctor_id:
        return jsonify({"error": "Unauthorized"}), 403

    if appointment.status != "approved":
        return jsonify({"error": f"Cannot start consultation at status '{appointment.status}'"}), 400

    appointment.status = "in_progress"

    consultation = Consultation(
        appointment_id=appointment.id,
        doctor_id=doctor_id,
        patient_id=appointment.patient_id
    )
    db.session.add(consultation)
    db.session.commit()

    return jsonify({
        "message": "Physical consultation started",
        "consultation": consultation.to_dict()
    }), 200



# ==========================================================
# 3. DOCTOR WRITES CONSULTATION NOTES
# ==========================================================
@appointment_bp.route("/consultation/<int:consultation_id>/notes", methods=["PUT"])
@jwt_required()
@role_required(["doctor"])
def write_notes(consultation_id):
    doctor_id = get_jwt_identity()
    consultation = Consultation.query.get_or_404(consultation_id)

    if consultation.doctor_id != doctor_id:
        return jsonify({"error": "You are not assigned to this consultation"}), 403

    data = request.get_json() or {}

    consultation.symptoms = data.get("symptoms", consultation.symptoms)
    consultation.examination = data.get("examination", consultation.examination)
    consultation.diagnosis = data.get("diagnosis", consultation.diagnosis)
    consultation.prescription = data.get("prescription", consultation.prescription)
    consultation.notes = data.get("notes", consultation.notes)

    db.session.commit()

    return jsonify({
        "message": "Consultation notes updated",
        "consultation": consultation.to_dict()
    }), 200


# ==========================================================
# 4. END CONSULTATION
# ==========================================================
@appointment_bp.route("/<int:appointment_id>/end", methods=["PUT"])
@jwt_required()
@role_required(["doctor"])
def end_consultation(appointment_id):
    doctor_id = get_jwt_identity()
    appointment = Appointment.query.get_or_404(appointment_id)

    if appointment.doctor_id != doctor_id:
        return jsonify({"error": "Unauthorized"}), 403

    if appointment.status != "in_progress":
        return jsonify({"error": "Consultation is not active"}), 400

    appointment.status = "done"
    db.session.commit()

    return jsonify({
        "message": "Consultation ended successfully",
        "appointment": appointment.to_dict()
    }), 200
    
    

@appointment_bp.route("/<int:appointment_id>/approve", methods=["PUT"])
@jwt_required()
@role_required(["doctor"])
def approve_appointment(appointment_id):
    doctor_id = get_jwt_identity()
    doctor = User.query.get(doctor_id)

    appointment = Appointment.query.get_or_404(appointment_id)

    # Ensure doctor is approving THEIR OWN appointment
    if appointment.doctor_id != doctor.id:
        return jsonify({"error": "You can only approve your own appointments"}), 403

    if appointment.status not in ["pending"]:
        return jsonify({"error": f"Cannot approve appointment with status '{appointment.status}'"}), 400

    appointment.status = "approved"
    db.session.commit()

    return jsonify({"message": "Appointment approved", "appointment": appointment.to_dict()}), 200



@appointment_bp.route("/<int:appointment_id>/reject", methods=["PUT"])
@jwt_required()
@role_required(["doctor"])
def reject_appointment(appointment_id):
    doctor_id = get_jwt_identity()
    doctor = User.query.get(doctor_id)

    appointment = Appointment.query.get_or_404(appointment_id)

    # Ensure doctor is rejecting THEIR OWN appointment
    if appointment.doctor_id != doctor.id:
        return jsonify({"error": "You can only reject your own appointments"}), 403

    if appointment.status not in ["pending"]:
        return jsonify({"error": f"Cannot reject appointment with status '{appointment.status}'"}), 400

    appointment.status = "cancelled"  # Or "rejected" if you prefer
    db.session.commit()

    return jsonify({"message": "Appointment rejected", "appointment": appointment.to_dict()}), 200