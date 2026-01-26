from app.extensions import db
from datetime import datetime

class DoctorApplication(db.Model):
    __tablename__ = "doctor_applications"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(20), nullable=True)
    years_of_experience = db.Column(db.Integer, nullable=False)
    medicalLicenceNumber = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    speciality_id = db.Column(db.Integer, db.ForeignKey("specialities.id"), nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Optional fields if you want doctor to upload documents later
    documents = db.Column(db.String(250), nullable=True)

    # Relationships
    speciality = db.relationship("Speciality", back_populates="doctor_applications") # Many-to-one relationship
    def to_dict(self):
        """Return basic data about the doctor application."""
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "gender": self.gender,
            "speciality_id": self.speciality_id,
            "speciality": self.speciality.to_dict() if self.speciality else None,
            "years_of_experience": self.years_of_experience,
            "medicalLicenceNumber": self.medicalLicenceNumber,
            "bio": self.bio,
            "status": self.status,
            "created_at": self.created_at,
            "documents": self.documents
        }
    
