from extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    
    phone = db.Column(db.String(20), unique=True, nullable=True)

    role = db.Column(db.String(50), default="USER")
    kyc_status = db.Column(db.String(50), default="UNVERIFIED")
    account_status = db.Column(db.String(50), default="ACTIVE")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    ledger_account = db.relationship("LedgerAccount", backref="user", uselist=False)
