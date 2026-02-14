from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Doctor(db.Model):
    __tablename__ = "doctors"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    speciality_id = db.Column(db.Integer, db.ForeignKey("specialities.id"), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    currency = db.Column(db.String(10), nullable=True)
    consultation_fee = db.Column(db.Float, nullable=True)
    rating = db.Column(db.Float, nullable=True)
    experience_years = db.Column(db.Integer, nullable=False)
    profile_picture = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False, default="active")  # active, inactive, suspended
    phone = db.Column(db.String(50), nullable=True)
    medicalLicenceNumber = db.Column(db.String(100), nullable=True)
    joined_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship("User", back_populates="doctor_profile", uselist=False) # One-to-one relationship
    speciality = db.relationship("Speciality", back_populates="doctors") # Many-to-one relationship
    availabilities = db.relationship("DoctorAvailability", back_populates="doctor") # One-to-many relationship
    appointments = db.relationship("Appointment", back_populates="doctor") # One-to-many relationship

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "experience_years": self.experience_years,
            "currency": self.currency,
            "consultation_fee": self.consultation_fee,
            "profile_picture": self.profile_picture,
            "location": self.location or "location not set",
            "phone": self.phone,
            "joined_at": self.joined_at,
            "bio": self.bio,
            "medicalLicenceNumber": self.medicalLicenceNumber,
            "user": {
                "id": self.user.id,
                "name": self.user.name,
                "email": self.user.email,
            },

            "speciality": {
                "id": self.speciality.id,
                "name": self.speciality.name,
            }
        }
