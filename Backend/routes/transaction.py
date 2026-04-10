from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.transaction import Transaction
from models.ledger import LedgerAccount
from services.ledger_service import LedgerService
from services.fraud_service import FraudService
import uuid

transaction_bp = Blueprint("transactions", __name__)


@transaction_bp.route("/", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = int(get_jwt_identity())

    txs = Transaction.query.filter(
        (Transaction.sender_id == user_id) |
        (Transaction.receiver_id == user_id)
    ).order_by(Transaction.created_at.desc()).all()

    result = []
    for tx in txs:
        is_sent = tx.sender_id == user_id
        result.append({
            "id": tx.id,
            "reference": tx.reference,
            "amount": tx.amount,
            "type": "sent" if is_sent else "received",
            "status": tx.status.lower(),
            "created_at": tx.created_at.isoformat(),
            "recipient_name": (
                f"User #{tx.receiver_id}" if is_sent else f"User #{tx.sender_id}"
            ),
        })

    return jsonify({"transactions": result})


@transaction_bp.route("/<int:tx_id>", methods=["GET"])
@jwt_required()
def get_transaction(tx_id):
    user_id = int(get_jwt_identity())

    tx = Transaction.query.filter(
        Transaction.id == tx_id,
        (Transaction.sender_id == user_id) | (Transaction.receiver_id == user_id)
    ).first()

    if not tx:
        return jsonify({"message": "Transaction not found"}), 404

    is_sent = tx.sender_id == user_id

    return jsonify({
        "id": tx.id,
        "reference": tx.reference,
        "amount": tx.amount,
        "type": "sent" if is_sent else "received",
        "status": tx.status.lower(),
        "created_at": tx.created_at.isoformat(),
        "recipient_name": (
            f"User #{tx.receiver_id}" if is_sent else f"User #{tx.sender_id}"
        ),
        "risk_score": tx.risk_score,
    })


@transaction_bp.route("/transfer", methods=["POST"])
@jwt_required()
def transfer():
    sender_id = int(get_jwt_identity())
    data = request.json
    receiver_id = data.get("receiver_id")
    amount = data.get("amount")

    if not receiver_id or not amount:
        return jsonify({"message": "receiver_id and amount are required"}), 400

    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid amount"}), 400

    if amount <= 0:
        return jsonify({"message": "Amount must be greater than zero"}), 400

    if sender_id == receiver_id:
        return jsonify({"message": "Cannot transfer to yourself"}), 400


    sender_account = LedgerAccount.query.filter_by(user_id=sender_id).first()
    if not sender_account:
        return jsonify({"message": "Sender account not found"}), 404

    
    receiver_account = LedgerAccount.query.filter_by(user_id=receiver_id).first()
    if not receiver_account:
        return jsonify({"message": "Receiver not found"}), 404


    sender_balance = LedgerService.calculate_balance(sender_account.id)
    if sender_balance < amount:
        return jsonify({"message": "Insufficient balance"}), 422

   
    risk = FraudService.calculate_risk(amount)
    if risk >= 0.9:
        return jsonify({"message": "Transaction flagged as high risk. Please contact support."}), 422

    #
    tx = Transaction(
        reference=str(uuid.uuid4()),
        type="TRANSFER",
        status="COMPLETED",
        amount=amount,
        sender_id=sender_id,
        receiver_id=receiver_id,
        risk_score=risk,
    )

    db.session.add(tx)
    db.session.commit()

    LedgerService.create_double_entry(sender_account, receiver_account, tx.id, amount)

    return jsonify({
        "message": "Transfer successful",
        "transaction": {
            "id": tx.id,
            "reference": tx.reference,
            "amount": tx.amount,
            "status": tx.status.lower(),
            "created_at": tx.created_at.isoformat(),
        }
    }), 201


@transaction_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    user_id = int(get_jwt_identity())

    txs = Transaction.query.filter(
        (Transaction.sender_id == user_id) |
        (Transaction.receiver_id == user_id)
    ).all()

    total_sent = sum(tx.amount for tx in txs if tx.sender_id == user_id)
    total_received = sum(tx.amount for tx in txs if tx.receiver_id == user_id)

    return jsonify({
        "total_sent": round(total_sent, 2),
        "total_received": round(total_received, 2),
        "transaction_count": len(txs),
    })