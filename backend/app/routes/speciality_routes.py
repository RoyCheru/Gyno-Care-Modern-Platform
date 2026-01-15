from flask import Blueprint, jsonify, request
from app.extensions import db
from flask_jwt_extended import jwt_required
from app.utils.permissions import role_required
from app.models.specialities import Speciality

speciality_bp = Blueprint("speciality_bp", __name__, url_prefix="/api/specialities")

@speciality_bp.route("/", methods=["POST"])
@jwt_required()
@role_required(["admin"])
def create_speciality():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"msg": "Speciality name is required"}), 400

    existing = Speciality.query.filter_by(name=name).first()
    if existing:
        return jsonify({"msg": "Speciality already exists"}), 400

    speciality = Speciality(name=name, description=description)
    db.session.add(speciality)
    db.session.commit()

    return jsonify({"msg": "Speciality created", "speciality": speciality.to_dict()}), 201

@speciality_bp.route("/", methods=["GET"])
def get_specialities():
    specialities = Speciality.query.all()
    return jsonify([s.to_dict() for s in specialities]), 200

@speciality_bp.route("/<int:speciality_id>", methods=["GET"])
def get_speciality(speciality_id):
    speciality = Speciality.query.get(speciality_id)
    if not speciality:
        return jsonify({"msg": "Speciality not found"}), 404
    return jsonify(speciality.to_dict()), 200

@speciality_bp.route("/<int:speciality_id>", methods=["DELETE"])
@jwt_required()
@role_required(["admin"])
def delete_speciality(speciality_id):
    speciality = Speciality.query.get(speciality_id)
    if not speciality:
        return jsonify({"msg": "Speciality not found"}), 404

    db.session.delete(speciality)
    db.session.commit()

    return jsonify({"msg": "Speciality deleted"}), 200

@speciality_bp.route("/<int:speciality_id>", methods=["PATCH"])
@jwt_required()
@role_required(["admin"])
def update_speciality(speciality_id):
    speciality = Speciality.query.get(speciality_id)
    if not speciality:
        return jsonify({"msg": "Speciality not found"}), 404

    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if name:
        speciality.name = name
    if description:
        speciality.description = description

    db.session.commit()

    return jsonify({"msg": "Speciality updated", "speciality": speciality.to_dict()}), 200