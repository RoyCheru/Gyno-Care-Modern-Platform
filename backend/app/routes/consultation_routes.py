from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.permissions import role_required
from app.models.consultation import Consultation
from app.extensions import db

start_consultation_bp = Blueprint("consultation_bp", __name__, url_prefix="/api/consultations")

@consultation_bp.route("/start", methods=["POST"])
@jwt_required()
@role_required(["doctor"])
def start_consultation():
    doctor_user_id = get_jwt_identity()
    from app.models.appointments import Appointment
    data = request.get_json()
    appointment_id = data.get("appointment_id")
    if not appointment_id:
        return jsonify({"msg": "appointment_id required"}), 400
    appointment = Appointment.query.filter_by(id=appointment_id, doctor_id=doctor_user_id).first()
    if not appointment:
        return jsonify({"msg": "Appointment not found"}), 404
    # Payment gate (single source of truth)
    if appointment.status != "paid":
        return jsonify({"msg": "Appointment not paid"}), 403

    if appointment.consultation:
        return jsonify({"msg": "Consultation already started"}), 400

    consultation = Consultation(
        appointment_id=appointment.id,
        doctor_id=appointment.doctor_id,
        patient_id=appointment.patient_id,
        start_time=datetime.utcnow(),
        status="in_progress"
    )

    appointment.status = "in_progress"

    db.session.add(consultation)
    db.session.commit()

    return jsonify({
        "msg": "Consultation started successfully",
        "consultation_id": consultation.id
    }), 201

@consultation_bp.route("/<int:consultation_id>/complete", methods=["PATCH"])
@jwt_required()
@role_required(["doctor"])
def complete_consultation(consultation_id):
    doctor_user_id = get_jwt_identity()
    consultation = Consultation.query.filter_by(id=consultation_id, doctor_id=doctor_user_id).first()
    if not consultation:
        return jsonify({"msg": "Consultation not found"}), 404
    if consultation.status != "in_progress":
        return jsonify({"msg": "Consultation not in progress"}), 400

    data = request.get_json()
    consultation.diagnosis = data.get("diagnosis", consultation.diagnosis)
    consultation.prescription = data.get("prescription", consultation.prescription)
    consultation.notes = data.get("notes", consultation.notes)
    consultation.status = "completed"
    consultation.end_time = datetime.utcnow()
    
    # Update appointment status
    appointment = Appointment.query.filter_by(id=consultation.appointment_id).first()
    appointment.status = "completed"
    
    db.session.commit()

    return jsonify({"msg": "Consultation completed successfully"}), 200

# Patient view consultation details (read only)
@consultation_bp.route("/<int:consultation_id>", methods=["GET"])
@jwt_required()
@role_required(["patient"])
def get_consultation_details(consultation_id):
    patient_user_id = get_jwt_identity()
    consultation = Consultation.query.filter_by(id=consultation_id, patient_id=patient_user_id).first()
    if not consultation:
        return jsonify({"msg": "Consultation not found"}), 404
    return jsonify(consultation.to_dict()), 200