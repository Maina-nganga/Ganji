from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.Beneficiary import Beneficiary

Beneficiaries_bp = Blueprint("Beneficiaries", __name__)


@Beneficiaries_bp.route("/", methods=["GET"])
@jwt_required()
def get_beneficiaries():
    user_id = int(get_jwt_identity())
    items = Beneficiary.query.filter_by(user_id=user_id).order_by(Beneficiary.created_at.desc()).all()
    return jsonify({
        "beneficiaries": [b.to_dict() for b in items]
    })


@Beneficiaries_bp.route("/", methods=["POST"])
@jwt_required()
def add_beneficiary():
    user_id = int(get_jwt_identity())
    data = request.json

    name = data.get("name", "").strip()
    account = data.get("account", "").strip()
    bank = data.get("bank", "").strip()
    phone = data.get("phone", "").strip()

    if not name or not account:
        return jsonify({"message": "Name and account number are required"}), 400

    
    existing = Beneficiary.query.filter_by(user_id=user_id, account=account).first()
    if existing:
        return jsonify({"message": "Beneficiary with this account already exists"}), 409

    b = Beneficiary(
        user_id=user_id,
        name=name,
        account=account,
        bank=bank,
        phone=phone,
    )
    db.session.add(b)
    db.session.commit()

    return jsonify({"message": "Beneficiary added", "beneficiary": b.to_dict()}), 201


@Beneficiaries_bp.route("/<int:beneficiary_id>", methods=["DELETE"])
@jwt_required()
def delete_beneficiary(beneficiary_id):
    user_id = int(get_jwt_identity())
    b = Beneficiary.query.filter_by(id=beneficiary_id, user_id=user_id).first()

    if not b:
        return jsonify({"message": "Beneficiary not found"}), 404

    db.session.delete(b)
    db.session.commit()
    return jsonify({"message": "Beneficiary removed"})