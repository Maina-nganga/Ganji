from extensions import db
from datetime import datetime

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    action = db.Column(db.String(255))
    ip_address = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
