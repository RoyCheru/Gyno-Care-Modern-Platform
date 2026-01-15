from app.extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # e.g. credit_card, paypal
    status = db.Column(db.String(20), nullable=False, default="pending")  # pending, completed, failed

    transaction_id = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    appointment = db.relationship("Appointment", back_populates="payment", uselist=False) # One-to-one relationship
    doctor = db.relationship("User", foreign_keys=[doctor_id]) 
    patient = db.relationship("User", foreign_keys=[patient_id])

    def to_dict(self):
        """Return basic data about the payment."""
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "status": self.status,
            "doctor_id": self.doctor_id,
            "patient_id": self.patient_id,
            "transaction_id": self.transaction_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }