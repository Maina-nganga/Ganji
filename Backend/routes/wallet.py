from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.transaction import Transaction
from models.ledger import LedgerAccount, LedgerEntry
from services.ledger_service import LedgerService
import uuid
from datetime import datetime

wallet_bp = Blueprint("wallet", __name__)

@wallet_bp.route("/", methods=["GET"])
@jwt_required()
def get_balance():
    user_id = int(get_jwt_identity())
    account = LedgerAccount.query.filter_by(user_id=user_id).first()
    if not account:
        return jsonify({"message": "Wallet not found"}), 404
    balance = LedgerService.calculate_balance(account.id)
    return jsonify({"balance": round(balance, 2)})

@wallet_bp.route("/deposit", methods=["POST"])
@jwt_required()
def deposit():
    user_id = int(get_jwt_identity())
    data = request.json
    amount = data.get("amount")
    if not amount:
        return jsonify({"message": "Amount is required"}), 400
    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid amount"}), 400
    if amount <= 0:
        return jsonify({"message": "Amount must be greater than zero"}), 400
    account = LedgerAccount.query.filter_by(user_id=user_id).first()
    if not account:
        return jsonify({"message": "Wallet not found"}), 404
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
    new_balance = LedgerService.calculate_balance(account.id)
    return jsonify({
        "message": "Deposit successful",
        "balance": round(new_balance, 2),
        "transaction": {
            "id": tx.id,
            "reference": tx.reference,
            "amount": tx.amount,
            "status": tx.status.lower(),
            "created_at": tx.created_at.isoformat(),
        }
    }), 201

@wallet_bp.route("/withdraw", methods=["POST"])
@jwt_required()
def withdraw():
    user_id = int(get_jwt_identity())
    data = request.json
    amount = data.get("amount")
    if not amount:
        return jsonify({"message": "Amount is required"}), 400
    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid amount"}), 400
    if amount <= 0:
        return jsonify({"message": "Amount must be greater than zero"}), 400
    account = LedgerAccount.query.filter_by(user_id=user_id).first()
    if not account:
        return jsonify({"message": "Wallet not found"}), 404
    balance = LedgerService.calculate_balance(account.id)
    if balance < amount:
        return jsonify({"message": "Insufficient balance"}), 422
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
    entry = LedgerEntry(
        account_id=account.id,
        transaction_id=tx.id,
        debit=amount,
        credit=0,
    )
    db.session.add(entry)
    db.session.commit()
    new_balance = LedgerService.calculate_balance(account.id)
    return jsonify({
        "message": "Withdrawal successful",
        "balance": round(new_balance, 2),
        "transaction": {
            "id": tx.id,
            "reference": tx.reference,
            "amount": tx.amount,
            "status": tx.status.lower(),
            "created_at": tx.created_at.isoformat(),
        }
    }), 201