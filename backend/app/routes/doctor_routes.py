from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.doctoravailability import DoctorAvailability
from app.extensions import db
from datetime import time
from app.utils.permissions import role_required

doctor_bp = Blueprint("doctor_bp", __name__, url_prefix="/api/doctors")

@doctor_bp.route("/availability", methods=["POST"])
@jwt_required()
@role_required(["doctor"])
def add_availability():
    from datetime import datetime
    doctor_user_id = get_jwt_identity()["id"]
    from app.models.doctors import Doctor
    doctor = Doctor.query.filter_by(user_id=doctor_user_id).first()
    if not doctor:
        return jsonify({"error": "Doctor profile not found"}), 404
    doctor_id = doctor.id
    data = request.get_json()

    day = data.get("day_of_week")
    start_time_str = data.get("start_time")
    end_time_str = data.get("end_time")

    if not all([day, start_time_str, end_time_str]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        start_time = datetime.strptime(start_time_str, "%H:%M").time()
        end_time = datetime.strptime(end_time_str, "%H:%M").time()
    except ValueError:
        return jsonify({"error": "Invalid time format. Use HH:MM"}), 400
    
    availability = DoctorAvailability(
        doctor_id=doctor_id,
        day_of_week=day,
        start_time=start_time,
        end_time=end_time,
    )
    db.session.add(availability)
    db.session.commit()

    return jsonify({"msg": "Availability added"}), 201

@doctor_bp.route("/profile", methods=["GET"])
@jwt_required()
@role_required(["doctor"])
def get_doctor_profile():
    doctor_user_id = get_jwt_identity()
    from app.models.doctor import Doctor
    from app.models.speciality import Speciality

    doctor = Doctor.query.filter_by(user_id=doctor_user_id).first()
    if not doctor:
        return jsonify({"msg": "Doctor profile not found"}), 404

    return jsonify(doctor.to_dict()), 200

@doctor_bp.route("/profile/update", methods=["PATCH"])
@jwt_required()
@role_required(["doctor"])
def update_doctor_profile():
    doctor_user_id = get_jwt_identity()
    data = request.get_json()
    from app.models.doctors import Doctor
    from app.models.specialities import Speciality
    doctor = Doctor.query.filter_by(user_id=doctor_user_id).first()
    if not doctor:
        return jsonify({"msg": "Doctor profile not found"}), 404

    # Update fields if provided
    if "bio" in data:
        doctor.bio = data["bio"]

    if "consultation_fee" in data:
        try:
            doctor.consultation_fee = float(data["consultation_fee"])
        except:
            return jsonify({"error": "Consultation fee must be a number"}), 400

    if "speciality_id" in data:
        speciality_id = data["speciality_id"]
        if not Speciality.query.get(speciality_id):
            return jsonify({"error": "Invalid speciality_id"}), 400
        doctor.speciality_id = speciality_id

    if "profile_picture" in data:
        doctor.profile_picture = data["profile_picture"]

    db.session.commit()
    

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.user.name,
            "email": self.user.email,
            "speciality": self.speciality.name,
            "speciality_id": self.speciality_id,
            "consultation_fee": self.consultation_fee,
            "bio": self.bio,
            "profile_picture": self.profile_picture,
            "experience_years": self.user.experience_years,
            "status": self.status
        }
    return jsonify({"msg": "Profile updated successfully", "doctor": doctor.to_dict()}), 200

@doctor_bp.route("/profile/user", methods=["PATCH"])
@jwt_required()
@role_required(["doctor"])
def update_profile():
    doctor_id = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(doctor_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    # Update name
    if "name" in data:
        if not data["name"].strip():
            return jsonify({"error": "Name cannot be empty"}), 400
        user.name = data["name"].strip()

    # Update phone
    if "phone" in data:
        user.phone = data["phone"]

    # Optional: update email (must be unique)
    if "email" in data:
        new_email = data["email"].strip()
        existing_user = User.query.filter(User.email == new_email, User.id != user.id).first()
        if existing_user:
            return jsonify({"error": "Email is already in use"}), 400

        user.email = new_email

    db.session.commit()

    return jsonify({
        "message": "User profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "email": user.email
        }
    }), 200

@doctor_bp.route("/availability/update", methods=["PATCH"])
@jwt_required()
@role_required(["doctor"])
def update_availability():
    doctor_id = get_jwt_identity()
    data = request.get_json()

    availability_id = data.get("availability_id")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    availability = DoctorAvailability.query.filter_by(id=availability_id, doctor_id=doctor_id).first()
    if not availability:
        return jsonify({"msg": "Availability slot not found"}), 404

    if start_time:
        availability.start_time = start_time
    if end_time:
        availability.end_time = end_time

    db.session.commit()

    return jsonify({"msg": "Availability updated"}), 200

@doctor_bp.route("/search", methods=["GET"])
@jwt_required()
def search_doctors():
    speciality = request.args.get("speciality")
    gender = request.args.get("gender")
    location = request.args.get("location")
    min_fee = request.args.get("min_fee")
    max_fee = request.args.get("max_fee")
    date_str = request.args.get("available_date")

    query = Doctor.query.join(User, Doctor.user_id == User.id)

    # Filter by speciality
    if speciality:
        query = query.join(Speciality).filter(Speciality.name.ilike(f"%{speciality}%"))

    # Filter by gender
    if gender:
        query = query.filter(User.gender == gender)

    # Filter by location (if doctor has clinic / hospital assigned)
    if location:
        query = query.join(Clinic).filter(Clinic.location.ilike(f"%{location}%"))

    # Filter by consultation fee
    if min_fee:
        query = query.filter(Doctor.consultation_fee >= float(min_fee))

    if max_fee:
        query = query.filter(Doctor.consultation_fee <= float(max_fee))

    # Filter by availability (optional)
    if date_str:
        from datetime import datetime
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        weekday = date_obj.strftime("%A")

        # Join availability and ensure doctor has a free slot
        query = query.join(DoctorAvailability).filter(
            DoctorAvailability.day_of_week == weekday
        )

    doctors = query.all()
    return jsonify([doctor.to_dict() for doctor in doctors]), 200


@doctor_bp.route("/makeapplication", methods=["POST"])
def make_doctor_application():
    data = request.get_json()
    full_name = data.get("fullName")
    speciality_id = data.get("speciality_id")
    years_of_experience = data.get("years_of_experience")
    medicalLicenceNumber = data.get("medicalLicenceNumber")
    email = data.get("email")
    phone = data.get("phone")
    gender = data.get("gender")
    location = data.get("location")
    if not all([full_name, speciality_id, years_of_experience, email, phone]):
        return jsonify({"msg": "Missing required fields"}), 400
    from app.models.doctorsapplications import DoctorApplication
    existing = DoctorApplication.query.filter_by(email=email).first()
    if existing:
        return jsonify({"msg": "An application with this email already exists"}), 400
    application = DoctorApplication(
        full_name=full_name,
        speciality_id=speciality_id,
        years_of_experience=years_of_experience,
        email=email,
        phone=phone,
        medicalLicenceNumber=medicalLicenceNumber,
        bio=None,
        gender=gender,
        location=location
    )
    db.session.add(application)
    db.session.commit()
    return jsonify({"msg": "Application submitted successfully"}), 201

@doctor_bp.route("/all", methods=["GET"])
# @jwt_required()
def get_all_doctors():
    from app.models.doctors import Doctor 
    doctors = Doctor.query.all()
    return jsonify([doctor.to_dict() for doctor in doctors]), 200
@doctor_bp.route("/availability/<int:doctor_id>", methods=["GET"])
def get_doctor_availability(doctor_id):
    availabilities = DoctorAvailability.query.filter_by(doctor_id=doctor_id).all()
    return jsonify([a.to_dict() for a in availabilities]), 200

# available slots
#utility function
from datetime import datetime, timedelta

def generate_time_slots(start_time, end_time, duration_minutes=30):
    slots = []
    current = datetime.combine(datetime.today(), start_time)
    end = datetime.combine(datetime.today(), end_time)

    while current + timedelta(minutes=duration_minutes) <= end:
        slots.append({
            "start_time": current.time().strftime("%H:%M"),
            "end_time": (current + timedelta(minutes=duration_minutes)).time().strftime("%H:%M")
        })
        current += timedelta(minutes=duration_minutes)

    return slots


# @doctor_bp.route("/available-slots/<int:doctor_id>")
# def get_available_slots(doctor_id):
#     date_str = request.args.get("date")  # YYYY-MM-DD
#     date = datetime.strptime(date_str, "%Y-%m-%d").date()

#     availability = DoctorAvailability.query.filter_by(
#         doctor_id=doctor_id,
#         day_of_week=date.strftime("%A")
#     ).first()

#     if not availability:
#         return jsonify([])

#     slots = generate_time_slots(
#         availability.start_time,
#         availability.end_time
#     )
#     from app.models.appointments import Appointment
#     booked = Appointment.query.filter_by(
#         doctor_id=doctor_id,
#         date=date
#     ).all()

#     booked_starts = {b.start_time.strftime("%H:%M") for b in booked}

#     for slot in slots:
#         slot["is_available"] = slot["start_time"] not in booked_starts

#     return jsonify(slots)


@doctor_bp.route("/booked-slots/<int:doctor_id>", methods=["GET"])
def get_booked_slots(doctor_id):
    date_str = request.args.get("date")
    if not date_str:
        return jsonify({"msg": "date query parameter is required"}), 400

    from datetime import datetime, time
    date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

    from app.models.appointments import Appointment

    # start and end of the day
    start_dt = datetime.combine(date_obj, time.min)
    end_dt = datetime.combine(date_obj, time.max)

    appointments = Appointment.query.filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_time >= start_dt,
        Appointment.appointment_time <= end_dt,
        Appointment.status.in_(["pending", "approved"])
    ).all()

    booked_slots = [
         appt.appointment_time.strftime("%H:%M")  # 24-hour format
        for appt in appointments
    ]

    return jsonify(booked_slots), 200