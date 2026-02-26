from extensions import db
from datetime import datetime

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(120), unique=True)
    type = db.Column(db.String(50))  # transfer, deposit
    status = db.Column(db.String(50), default="PENDING")
    amount = db.Column(db.Float)
    sender_id = db.Column(db.Integer)
    receiver_id = db.Column(db.Integer)
    risk_score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
