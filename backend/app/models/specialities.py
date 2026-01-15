from app.extensions import db

class Speciality(db.Model):
    __tablename__ = "specialities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

    doctor_applications = db.relationship("DoctorApplication", back_populates="speciality") # One-to-many relationship
    doctors = db.relationship("Doctor", back_populates="speciality") # One-to-many relationship
    
    def to_dict(self):
        """Return basic data about the speciality."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }
        