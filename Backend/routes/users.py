from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

users_bp = Blueprint("users", __name__)


@users_bp.route("/search", methods=["GET"])
@jwt_required()
def search_users():
    current_user_id = int(get_jwt_identity())
    query = request.args.get("q", "").strip()

    if len(query) < 2:
        return jsonify({"users": []})

    results = User.query.filter(
        User.id != current_user_id,
        User.account_status == "ACTIVE",
        (User.email.ilike(f"%{query}%")) | (User.full_name.ilike(f"%{query}%"))
    ).limit(8).all()

    return jsonify({
        "users": [
            {"id": u.id, "full_name": u.full_name, "email": u.email}
            for u in results
        ]
    })