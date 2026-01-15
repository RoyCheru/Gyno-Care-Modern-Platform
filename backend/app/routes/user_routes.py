from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# @user_bp.route("/profile", methods=["GET"])
# @jwt_required()
# def get_profile():
#     identity = get_jwt_identity()
#     return jsonify(identity), 200
