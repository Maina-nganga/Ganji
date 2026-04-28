from extensions import db
from datetime import datetime

class LedgerAccount(db.Model):
    __tablename__ = "ledger_account"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    type = db.Column(db.String(50), default="USER_WALLET")

    entries = db.relationship("LedgerEntry", backref="account", lazy=True)


class LedgerEntry(db.Model):
    __tablename__ = "ledger_entries"

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("ledger_account.id"))
    transaction_id = db.Column(db.Integer)
    debit = db.Column(db.Float, default=0)
    credit = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)