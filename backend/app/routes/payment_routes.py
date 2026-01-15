from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.payment import Payment

payment_bp = Blueprint("payment_bp", __name__, url_prefix="/api/payments")
@payment_bp.route("/process", methods=["POST"])
@jwt_required()
def process_payment():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    appointment_id = data.get("appointment_id")
    payment_method = data.get("payment_method")

    if not appointment_id or not payment_method:
        return jsonify({"msg": "appointment_id and payment_method are required"}), 400

    from app.models.appointments import Appointment
    appointment = Appointment.query.filter_by(id=appointment_id, patient_id=user_id).first()
    if not appointment:
        return jsonify({"msg": "Appointment not found"}), 404
    if appointment.status == "paid":
        return jsonify({"msg": "Appointment already paid"}), 400
    # Derive amount from doctor's consultation fee
    amount = appointment.doctor.consultation_fee
    
    payment = Payment(
        patient_id=user_id,
        appointment_id=appointment.id,
        doctor_id=appointment.doctor_id,
        amount=amount,
        payment_method=payment_method,
        status="paid"  # In a real scenario, integrate with a payment gateway
    )
    appointment.status = "paid"  # Update appointment status to paid
    db.session.add(payment)
    db.session.commit()

    return jsonify({"msg": "Payment processed successfully", "payment_id": payment.id}), 201