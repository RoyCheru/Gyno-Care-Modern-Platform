from app.extensions import db

class Patients(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    emergency_contact = db.Column(db.String(100), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(20), nullable=True)

    user = db.relationship("User", back_populates="patient_profile") # One-to-one relationship
    

    def to_dict(self):
        """Return basic data about the patient."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.user.name,
            "email": self.user.email,
            "age": self.age
        }