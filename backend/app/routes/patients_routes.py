from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.utils.permissions import role_required

patient_bp = Blueprint("patient_bp", __name__, url_prefix="/api/patient")

@patient_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_patient_profile():
    patient_user_id = get_jwt_identity()
    from app.models.patient import Patient
    patient = Patient.query.filter_by(user_id=patient_user_id).first()
    if not patient:
        return jsonify({"msg": "Patient profile not found"}), 404
    return jsonify(patient.to_dict()), 200

@patient_bp.route("/profile/update", methods=["PATCH"])
@jwt_required()
@role_required(["patient"])
def update_patient_profile():
    patient_user_id = get_jwt_identity()
    data = request.get_json()
    patient = Patient.query.filter_by(user_id=patient_user_id).first()
    if not patient:
        return jsonify({"msg": "Patient profile not found"}), 404
    # update fields if provided
    if "age" in data:
        try:
            patient.age = int(data["age"])
        except:
            return jsonify({"error": "Age must be a number"}), 400
    if "gender" in data:
        patient.gender = data["gender"]
    db.session.commit()
    return jsonify({"msg": "Patient profile updated"}), 200
    ...
