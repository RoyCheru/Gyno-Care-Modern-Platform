import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:roy12345@localhost:5432/gynocare")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "your-jwt-secret-key"
