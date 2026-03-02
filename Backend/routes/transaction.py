from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.transaction import Transaction
from models.ledger import LedgerAccount
from services.ledger_service import LedgerService
from services.fraud_service import FraudService
import uuid

transaction_bp = Blueprint("transactions", __name__)

@transaction_bp.route("/transfer", methods=["POST"])
@jwt_required()
def transfer():
    sender_id = get_jwt_identity()
    data = request.json

    receiver_id = data["receiver_id"]
    amount = float(data["amount"])

    risk = FraudService.calculate_risk(amount)

    tx = Transaction(
        reference=str(uuid.uuid4()),
        type="TRANSFER",
        status="COMPLETED",
        amount=amount,
        sender_id=sender_id,
        receiver_id=receiver_id,
        risk_score=risk
    )

    db.session.add(tx)
    db.session.commit()

    sender_account = LedgerAccount.query.filter_by(user_id=sender_id).first()
    receiver_account = LedgerAccount.query.filter_by(user_id=receiver_id).first()

    LedgerService.create_double_entry(sender_account, receiver_account, tx.id, amount)

    return jsonify({"message": "Transfer successful"})
