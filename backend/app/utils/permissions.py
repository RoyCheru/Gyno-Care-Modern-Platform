from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, get_jwt
from flask import jsonify, request
from app.models.user import User

def role_required(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            # Allow CORS preflight
            if request.method == "OPTIONS":
                return '', 200

            # ✅ Explicitly verify JWT
            verify_jwt_in_request()
            claims = get_jwt()
            user_roles = claims.get("role", None)
            if not user_roles:
                return jsonify({"error": "Role not found in token"}), 401

            # identity = get_jwt_identity()
            # if not identity:
            #     return jsonify({"error": "Authentication required"}), 401

            # if identity.get("role") not in allowed_roles:
            #     return jsonify({"error": "You do not have permission to access this resource"}), 403
            if user_roles not in allowed_roles:
                return jsonify({"error": "You do not have permission to access this resource"}), 403
            return fn(*args, **kwargs)
        return decorated
    return wrapper
