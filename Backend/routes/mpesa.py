from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.mpesa_service import stk_push
from extensions import db
from models.transaction import Transaction
from models.ledger import LedgerAccount, LedgerEntry
from services.ledger_service import LedgerService
import uuid

mpesa_bp = Blueprint("mpesa", __name__)


pending_checkouts = {}

@mpesa_bp.route("/stk-push", methods=["POST"])
@jwt_required()
def initiate_stk():
    user_id = int(get_jwt_identity())
    data = request.json

    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"message": "Phone and amount are required"}), 400

    response = stk_push(phone, amount)

    if response.get("ResponseCode") == "0":
        checkout_id = response["CheckoutRequestID"]
      
        pending_checkouts[checkout_id] = {
            "user_id": user_id,
            "amount": float(amount)
        }
        return jsonify({
            "message": "STK push sent. Check your phone.",
            "checkout_request_id": checkout_id
        }), 200

    return jsonify({"message": "STK push failed", "details": response}), 400


@mpesa_bp.route("/callback", methods=["POST"])
def mpesa_callback():
    data = request.json
    body = data.get("Body", {}).get("stkCallback", {})

    result_code = body.get("ResultCode")
    checkout_id = body.get("CheckoutRequestID")

    if result_code == 0 and checkout_id in pending_checkouts:
        info = pending_checkouts.pop(checkout_id)
        user_id = info["user_id"]
        amount = info["amount"]

        account = LedgerAccount.query.filter_by(user_id=user_id).first()

        tx = Transaction(
            reference=str(uuid.uuid4()),
            type="DEPOSIT",
            status="COMPLETED",
            amount=amount,
            sender_id=user_id,
            receiver_id=user_id,
            risk_score=0.0,
        )
        db.session.add(tx)
        db.session.commit()

        entry = LedgerEntry(
            account_id=account.id,
            transaction_id=tx.id,
            credit=amount,
            debit=0,
        )
        db.session.add(entry)
        db.session.commit()

    return jsonify({"ResultCode": 0, "ResultDesc": "Success"})