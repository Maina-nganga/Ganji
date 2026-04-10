from extensions import db
from datetime import datetime

class LedgerAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    type = db.Column(db.String(50), default="USER_WALLET")

class LedgerEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("ledger_account.id"))
    transaction_id = db.Column(db.Integer)
    debit = db.Column(db.Float, default=0)
    credit = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
