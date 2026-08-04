def test_new_wallet_balance_is_zero(client, auth_headers):
    resp = client.get("/api/wallet/", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.get_json()["balance"] == 0


def test_deposit_increases_balance(client, auth_headers):
    resp = client.post("/api/wallet/deposit", json={"amount": 500}, headers=auth_headers)
    assert resp.status_code == 201
    assert resp.get_json()["balance"] == 500

    balance_resp = client.get("/api/wallet/", headers=auth_headers)
    assert balance_resp.get_json()["balance"] == 500


def test_deposit_rejects_zero_and_negative_amounts(client, auth_headers):
    for bad_amount in (0, -50):
        resp = client.post("/api/wallet/deposit", json={"amount": bad_amount}, headers=auth_headers)
        assert resp.status_code == 400


def test_deposit_rejects_non_numeric_amount(client, auth_headers):
    resp = client.post("/api/wallet/deposit", json={"amount": "not-a-number"}, headers=auth_headers)
    assert resp.status_code == 400


def test_withdraw_decreases_balance(client, auth_headers):
    client.post("/api/wallet/deposit", json={"amount": 1000}, headers=auth_headers)

    resp = client.post("/api/wallet/withdraw", json={"amount": 300}, headers=auth_headers)
    assert resp.status_code == 201
    assert resp.get_json()["balance"] == 700


def test_withdraw_more_than_balance_is_rejected(client, auth_headers):
    client.post("/api/wallet/deposit", json={"amount": 100}, headers=auth_headers)

    resp = client.post("/api/wallet/withdraw", json={"amount": 500}, headers=auth_headers)
    assert resp.status_code == 422
    # Balance must be unchanged after a rejected withdrawal.
    balance_resp = client.get("/api/wallet/", headers=auth_headers)
    assert balance_resp.get_json()["balance"] == 100


def test_wallet_endpoints_require_authentication(client):
    assert client.get("/api/wallet/").status_code == 401
    assert client.post("/api/wallet/deposit", json={"amount": 100}).status_code == 401
    assert client.post("/api/wallet/withdraw", json={"amount": 100}).status_code == 401
