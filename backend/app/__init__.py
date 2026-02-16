from flask import Flask
from flask_migrate import Migrate
from .extensions import db, jwt, cors, migrate
from app.routes.appointment_routes import appointment_bp
from app.routes.main_routes import main_bp
from app.routes.admin_routes import admin_bp
from app.routes.doctor_routes import doctor_bp
from app.routes.patients_routes import patient_bp
from app.routes.speciality_routes import speciality_bp
# from app.routes.user_routes import user_bp
from .routes.auth_routes import auth_bp
from .config import Config
# from app.routes.user_routes import user_bp
# from app.routes.doctor_routes import doctor_bp
# from app.routes.patient_routes import patient_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    cors.init_app(app, resources={r"/*": {"origins": [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://localhost:3000",  # Next.js default port
        "https://gyno-care-modern-platform.vercel.app"
    ]}}, supports_credentials=True)
    
    # import all models so Flask-Migrate can detect them
    from app.models.user import User
    from app.models.doctors import Doctor
    from app.models.patients import Patients
    from app.models.appointments import Appointment
    from app.models.consultation import Consultation
    from app.models.payments import Payment
    from app.models.specialities import Speciality
    from app.models.doctoravailability import DoctorAvailability
    from app.models.admin import Admin
    from app.models.doctorsapplications import DoctorApplication
    

    # Register blueprints (will add later)
    app.register_blueprint(main_bp, url_prefix="/api")
    app.register_blueprint(auth_bp)
    app.register_blueprint(appointment_bp)
    app.register_blueprint(admin_bp)
    # app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(doctor_bp)
    app.register_blueprint(patient_bp)
    app.register_blueprint(speciality_bp)

    return app
