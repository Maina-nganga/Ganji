
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ledger_service import LedgerService
from models.ledger import LedgerAccount

wallet_bp = Blueprint("wallet", __name__)

@wallet_bp.route("/", methods=["GET"])
@jwt_required()
def get_balance():
    user_id = get_jwt_identity()
    account = LedgerAccount.query.filter_by(user_id=user_id).first()

    balance = LedgerService.calculate_balance(account.id)

    return jsonify({"balance": balance})
