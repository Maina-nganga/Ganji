from extensions import db
from datetime import datetime


class Beneficiary(db.Model):
    __tablename__ = "beneficiaries"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name       = db.Column(db.String(120), nullable=False)
    account    = db.Column(db.String(100), nullable=False)
    bank       = db.Column(db.String(100), nullable=True)
    phone      = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "name":       self.name,
            "account":    self.account,
            "bank":       self.bank or "",
            "phone":      self.phone or "",
            "created_at": self.created_at.isoformat(),
        }