from extensions import db
from models.ledger import LedgerEntry, LedgerAccount

class LedgerService:

    @staticmethod
    def create_double_entry(sender_account, receiver_account, transaction_id, amount):
        debit_entry = LedgerEntry(
            account_id=sender_account.id,
            transaction_id=transaction_id,
            debit=amount,
            credit=0
        )

        credit_entry = LedgerEntry(
            account_id=receiver_account.id,
            transaction_id=transaction_id,
            debit=0,
            credit=amount
        )

        db.session.add(debit_entry)
        db.session.add(credit_entry)
        db.session.commit()

    @staticmethod
    def calculate_balance(account_id):
        entries = LedgerEntry.query.filter_by(account_id=account_id).all()
        balance = sum(e.credit - e.debit for e in entries)
        return balance
