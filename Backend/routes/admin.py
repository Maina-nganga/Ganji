from flask import Blueprint, jsonify
from utils.decorators import role_required
from models.transaction import Transaction
from models.user import User

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/users", methods=["GET"])
@role_required("ADMIN")
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email} for u in users])

@admin_bp.route("/transactions", methods=["GET"])
@role_required("ADMIN")
def get_transactions():
    txs = Transaction.query.all()
    return jsonify([{"id": t.id, "amount": t.amount} for t in txs])
