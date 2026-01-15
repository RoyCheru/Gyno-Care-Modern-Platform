from app.extensions import db
from datetime import datetime

class DoctorAvailability(db.Model):
    __tablename__ = "doctor_availability"

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)

    day_of_week = db.Column(db.String(10), nullable=False)  
    # e.g. "Monday", "Tuesday"

    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    doctor = db.relationship("Doctor", back_populates="availabilities") # Many-to-one relationship
    def to_dict(self):
        """Return basic data about the doctor's availability."""
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "day_of_week": self.day_of_week,
            "start_time": self.start_time.strftime("%H:%M"),
            "end_time": self.end_time.strftime("%H:%M"),
        }
