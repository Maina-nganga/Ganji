from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.mpesa_service import stk_push, b2c_payment
from extensions import db
from models.transaction import Transaction
from models.ledger import LedgerAccount, LedgerEntry
from services.ledger_service import LedgerService
import uuid

mpesa_bp = Blueprint("mpesa", __name__)

pending_deposits = {}     
pending_withdrawals = {}  




@mpesa_bp.route("/pay-till", methods=["POST"])
@jwt_required()
def initiate_till_payment():
    user_id = int(get_jwt_identity())
    data = request.json

    phone       = data.get("phone")
    amount      = data.get("amount")
    till_number = data.get("till_number")
    account_ref = data.get("account_ref", "Payment")

    if not all([phone, amount, till_number]):
        return jsonify({"message": "phone, amount and till_number are required"}), 400

    try:
        response = pay_till(phone, float(amount), till_number, account_ref)
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    if response.get("ResponseCode") == "0":
        checkout_id = response["CheckoutRequestID"]
        pending_deposits[checkout_id] = {"user_id": user_id, "amount": float(amount)}
        return jsonify({"message": "STK push sent to Till. Check your phone.", "checkout_request_id": checkout_id}), 200

    return jsonify({"message": "Till payment failed", "details": response}), 400


@mpesa_bp.route("/pay-paybill", methods=["POST"])
@jwt_required()
def initiate_paybill_payment():
    user_id = int(get_jwt_identity())
    data = request.json

    phone          = data.get("phone")
    amount         = data.get("amount")
    paybill_number = data.get("paybill_number")
    account_number = data.get("account_number")

    if not all([phone, amount, paybill_number, account_number]):
        return jsonify({"message": "phone, amount, paybill_number and account_number are required"}), 400

    try:
        response = pay_paybill(phone, float(amount), paybill_number, account_number)
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    if response.get("ResponseCode") == "0":
        checkout_id = response["CheckoutRequestID"]
        pending_deposits[checkout_id] = {"user_id": user_id, "amount": float(amount)}
        return jsonify({"message": "STK push sent to Paybill. Check your phone.", "checkout_request_id": checkout_id}), 200

    return jsonify({"message": "Paybill payment failed", "details": response}), 400


@mpesa_bp.route("/stk-push", methods=["POST"])
@jwt_required()
def initiate_stk():
    user_id = int(get_jwt_identity())
    data = request.json

    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"message": "Phone and amount are required"}), 400

    try:
        response = stk_push(phone, float(amount))
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    if response.get("ResponseCode") == "0":
        checkout_id = response["CheckoutRequestID"]
        pending_deposits[checkout_id] = {
            "user_id": user_id,
            "amount": float(amount)
        }
        return jsonify({
            "message": "STK push sent. Check your phone.",
            "checkout_request_id": checkout_id
        }), 200

    return jsonify({"message": "STK push failed", "details": response}), 400




@mpesa_bp.route("/withdraw", methods=["POST"])
@jwt_required()
def initiate_withdrawal():
    user_id = int(get_jwt_identity())
    data = request.json

    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"message": "Phone and amount are required"}), 400

    amount = float(amount)

   
    account = LedgerAccount.query.filter_by(user_id=user_id).first()
    if not account:
        return jsonify({"message": "Wallet not found"}), 404

    balance = LedgerService.calculate_balance(account.id)
    if balance < amount:
        return jsonify({"message": "Insufficient balance"}), 422

    try:
        response = b2c_payment(phone, amount)
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    if response.get("ResponseCode") == "0":
        conversation_id = response["ConversationID"]
      
        _debit_wallet(user_id, amount)
        pending_withdrawals[conversation_id] = {
            "user_id": user_id,
            "amount": amount
        }
        return jsonify({
            "message": "Withdrawal initiated. Funds will arrive on your M-Pesa shortly.",
            "conversation_id": conversation_id
        }), 200

    return jsonify({"message": "Withdrawal failed", "details": response}), 400




@mpesa_bp.route("/callback/deposit", methods=["POST"])
def deposit_callback():
    data = request.json
    body = data.get("Body", {}).get("stkCallback", {})
    result_code = body.get("ResultCode")
    checkout_id = body.get("CheckoutRequestID")

    if result_code == 0 and checkout_id in pending_deposits:
        info = pending_deposits.pop(checkout_id)
        _credit_wallet(info["user_id"], info["amount"])
    else:
        
        pending_deposits.pop(checkout_id, None)

    return jsonify({"ResultCode": 0, "ResultDesc": "Success"})


@mpesa_bp.route("/callback/withdraw", methods=["POST"])
def withdraw_callback():
    data = request.json
    result = data.get("Result", {})
    result_code = result.get("ResultCode")
    conversation_id = result.get("ConversationID")

    if result_code == 0:
        pending_withdrawals.pop(conversation_id, None)
    else:
        
        if conversation_id in pending_withdrawals:
            info = pending_withdrawals.pop(conversation_id)
            _credit_wallet(info["user_id"], info["amount"])

    return jsonify({"ResultCode": 0, "ResultDesc": "Success"})


@mpesa_bp.route("/callback/timeout", methods=["POST"])
def timeout_callback():
    data = request.json
    result = data.get("Result", {})
    conversation_id = result.get("ConversationID")


    if conversation_id in pending_withdrawals:
        info = pending_withdrawals.pop(conversation_id)
        _credit_wallet(info["user_id"], info["amount"])

    return jsonify({"ResultCode": 0, "ResultDesc": "Timeout acknowledged"})




def _credit_wallet(user_id, amount):
    account = LedgerAccount.query.filter_by(user_id=user_id).first()
    if not account:
        return

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

    db.session.add(LedgerEntry(
        account_id=account.id,
        transaction_id=tx.id,
        credit=amount,
        debit=0,
    ))
    db.session.commit()


def _debit_wallet(user_id, amount):
    account = LedgerAccount.query.filter_by(user_id=user_id).first()
    if not account:
        return

    tx = Transaction(
        reference=str(uuid.uuid4()),
        type="WITHDRAWAL",
        status="COMPLETED",
        amount=amount,
        sender_id=user_id,
        receiver_id=user_id,
        risk_score=0.0,
    )
    db.session.add(tx)
    db.session.commit()

    db.session.add(LedgerEntry(
        account_id=account.id,
        transaction_id=tx.id,
        debit=amount,
        credit=0,
    ))
    db.session.commit()