def _register_and_login(client, email, password="password123", full_name="User"):
    client.post("/api/auth/register", json={
        "full_name": full_name, "email": email, "password": password,
    })
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    return resp.get_json()["access_token"]


def _second_user_id(client):
    from models.user import User
    client.post("/api/auth/register", json={
        "full_name": "Receiver", "email": "receiver@example.com", "password": "password123",
    })
    return User.query.filter_by(email="receiver@example.com").first().id


def test_transfer_moves_funds_between_users(client, db, auth_headers):
    receiver_id = _second_user_id(client)
    client.post("/api/wallet/deposit", json={"amount": 1000}, headers=auth_headers)

    resp = client.post("/api/transactions/transfer", json={
        "receiver_id": receiver_id, "amount": 400,
    }, headers=auth_headers)
    assert resp.status_code == 201

    sender_balance = client.get("/api/wallet/", headers=auth_headers).get_json()["balance"]
    assert sender_balance == 600

    login_resp = client.post("/api/auth/login", json={
        "email": "receiver@example.com", "password": "password123",
    })
    receiver_token = login_resp.get_json()["access_token"]
    receiver_balance = client.get(
        "/api/wallet/", headers={"Authorization": f"Bearer {receiver_token}"}
    ).get_json()["balance"]
    assert receiver_balance == 400


def test_transfer_rejects_self_transfer(client, auth_headers):
    from models.user import User
    me = client.get("/api/auth/me", headers=auth_headers).get_json()

    resp = client.post("/api/transactions/transfer", json={
        "receiver_id": me["id"], "amount": 100,
    }, headers=auth_headers)
    assert resp.status_code == 400


def test_transfer_rejects_insufficient_balance(client, auth_headers):
    receiver_id = _second_user_id(client)

    resp = client.post("/api/transactions/transfer", json={
        "receiver_id": receiver_id, "amount": 50,
    }, headers=auth_headers)
    assert resp.status_code == 422


def test_transfer_to_nonexistent_user_is_rejected(client, auth_headers):
    client.post("/api/wallet/deposit", json={"amount": 1000}, headers=auth_headers)

    resp = client.post("/api/transactions/transfer", json={
        "receiver_id": 99999, "amount": 100,
    }, headers=auth_headers)
    assert resp.status_code == 404


def test_large_transfer_is_currently_always_blocked_as_high_risk(client, auth_headers):
    """
    Known issue: FraudService.calculate_risk() returns a score on a 0-40
    scale (see services/fraud_service.py), but transaction.py's transfer()
    checks `if risk >= 0.9`. Any amount over 10,000 scores 40, which is
    always >= 0.9 — so every transfer above 10,000 is currently rejected
    as "high risk" regardless of intent. This is very likely a scale
    mismatch (0-1 probability vs 0-100 score) rather than intended
    fraud logic.

    This test documents current behavior. Once the threshold/scale is
    reconciled, update this test to reflect the corrected behavior.
    """
    receiver_id = _second_user_id(client)
    client.post("/api/wallet/deposit", json={"amount": 20000}, headers=auth_headers)

    resp = client.post("/api/transactions/transfer", json={
        "receiver_id": receiver_id, "amount": 15000,
    }, headers=auth_headers)

    assert resp.status_code == 422
    assert "high risk" in resp.get_json()["message"].lower()


def test_transaction_history_reflects_transfer(client, auth_headers):
    receiver_id = _second_user_id(client)
    client.post("/api/wallet/deposit", json={"amount": 1000}, headers=auth_headers)
    client.post("/api/transactions/transfer", json={
        "receiver_id": receiver_id, "amount": 200,
    }, headers=auth_headers)

    resp = client.get("/api/transactions/", headers=auth_headers)
    assert resp.status_code == 200
    txs = resp.get_json()["transactions"]
    # Deposit + transfer = 2 transactions touching the sender.
    assert len(txs) == 2
    assert any(tx["type"] == "sent" and tx["amount"] == 200 for tx in txs)
