from models.ledger import LedgerAccount
from services.ledger_service import LedgerService
from services.fraud_service import FraudService


def test_calculate_balance_with_no_entries_is_zero(app, db):
    account = LedgerAccount(user_id=1)
    db.session.add(account)
    db.session.commit()

    assert LedgerService.calculate_balance(account.id) == 0


def test_double_entry_keeps_ledger_balanced(app, db):
    sender = LedgerAccount(user_id=1)
    receiver = LedgerAccount(user_id=2)
    db.session.add_all([sender, receiver])
    db.session.commit()

    LedgerService.create_double_entry(sender, receiver, transaction_id=1, amount=250)

    sender_balance = LedgerService.calculate_balance(sender.id)
    receiver_balance = LedgerService.calculate_balance(receiver.id)

    assert sender_balance == -250
    assert receiver_balance == 250
    # Every debit must have a matching credit — the ledger nets to zero.
    assert sender_balance + receiver_balance == 0


def test_fraud_risk_is_zero_below_threshold():
    assert FraudService.calculate_risk(5000) == 0
    assert FraudService.calculate_risk(10000) == 0


def test_fraud_risk_jumps_above_threshold():
    assert FraudService.calculate_risk(10001) == 40
