from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models.user import User
from models.ledger import LedgerAccount
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        password_hash=hashed
    )

    db.session.add(user)
    db.session.commit()

    account = LedgerAccount(user_id=user.id)
    db.session.add(account)
    db.session.commit()

    return jsonify({"message": "Registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if user and bcrypt.check_password_hash(user.password_hash, data["password"]):
        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token})

    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity()) 
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email
    })