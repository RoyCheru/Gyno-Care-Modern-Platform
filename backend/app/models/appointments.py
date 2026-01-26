from app.extensions import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)

    patient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)

    reason = db.Column(db.String(255), nullable=True)

    appointment_time = db.Column(db.DateTime, nullable=False)

    status = db.Column(db.String(20), nullable=False, default="scheduled")
    # pending, approved, rejected, cancelled, paid, in-progress, completed
    consultation_type = db.Column(db.String(20), nullable=False, default="virtual")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = db.relationship("User", foreign_keys=[patient_id])
    doctor = db.relationship("Doctor", back_populates="appointments")
    consultation = db.relationship("Consultation", back_populates="appointment", uselist=False) # One-to-one relationship
    payment = db.relationship("Payment", back_populates="appointment", uselist=False) # One-to-one relationship
    
    


    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "patient": {
                "id": self.patient.id,
                "name": self.patient.name,
                "email": self.patient.email,
            },
            "doctor_id": self.doctor_id,
            "doctor_user_id": self.doctor.user_id if self.doctor else None,
            "reason": self.reason,
            "appointment_time": self.appointment_time,
            "status": self.status,
            "doctor": self.doctor.to_dict() if self.doctor else None,
            "consultation_type": self.consultation_type,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
