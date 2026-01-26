from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="patient")  # patient, doctor, admin
    
    patient_profile = db.relationship("Patients", back_populates="user", uselist=False) # One-to-one relationship
    doctor_profile = db.relationship("Doctor", back_populates="user", uselist=False) # One-to-one relationship
    admin_profile = db.relationship("Admin", back_populates="user", uselist=False) # One-to-one relationship
    

    def to_dict(self):
        """Return basic data about the user."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "gender": self.gender
        }
