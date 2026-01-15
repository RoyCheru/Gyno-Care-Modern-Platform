from app.extensions import db
from datetime import datetime

class Consultation(db.Model):
    __tablename__ = "consultations"

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=False)

    doctor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    symptoms = db.Column(db.Text, nullable=True)
    examination = db.Column(db.Text, nullable=True)
    diagnosis = db.Column(db.Text, nullable=True)
    prescription = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="ongoing")  # ongoing, completed, cancelled
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    appointment = db.relationship("Appointment", back_populates="consultation", uselist=False) # One-to-one relationship
    doctor = db.relationship("User", foreign_keys=[doctor_id]) 
    patient = db.relationship("User", foreign_keys=[patient_id])

    def to_dict(self):
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "doctor_id": self.doctor_id,
            "patient_id": self.patient_id,
            "symptoms": self.symptoms,
            "examination": self.examination,
            "diagnosis": self.diagnosis,
            "prescription": self.prescription,
            "notes": self.notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
