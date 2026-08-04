def test_register_creates_user_and_wallet(client, db):
    from models.user import User
    from models.ledger import LedgerAccount

    resp = client.post("/api/auth/register", json={
        "full_name": "Jane Doe",
        "email": "jane@example.com",
        "password": "password123",
    })

    assert resp.status_code == 201
    user = User.query.filter_by(email="jane@example.com").first()
    assert user is not None
    # Registration should also open a ledger account for the new user.
    account = LedgerAccount.query.filter_by(user_id=user.id).first()
    assert account is not None


def test_register_duplicate_email_currently_crashes(client):
    """
    Known issue: /register has no handling for a duplicate email, so the
    unique constraint on User.email currently raises an UNHANDLED
    IntegrityError instead of a clean 400/409 JSON response — in
    production this would surface as a raw 500 to the client.

    This test pins down *current* behavior on purpose. Once auth.py wraps
    the commit in a try/except IntegrityError and returns e.g. 409, this
    test should be rewritten to assert `resp.status_code == 409` instead.
    """
    from sqlalchemy.exc import IntegrityError
    import pytest

    payload = {"full_name": "Jane Doe", "email": "dup@example.com", "password": "password123"}
    first = client.post("/api/auth/register", json=payload)
    assert first.status_code == 201

    with pytest.raises(IntegrityError):
        client.post("/api/auth/register", json=payload)


def test_login_with_correct_credentials_returns_token(client):
    client.post("/api/auth/register", json={
        "full_name": "Jane Doe", "email": "jane@example.com", "password": "password123",
    })

    resp = client.post("/api/auth/login", json={
        "email": "jane@example.com", "password": "password123",
    })

    assert resp.status_code == 200
    assert "access_token" in resp.get_json()


def test_login_with_wrong_password_is_rejected(client):
    client.post("/api/auth/register", json={
        "full_name": "Jane Doe", "email": "jane@example.com", "password": "password123",
    })

    resp = client.post("/api/auth/login", json={
        "email": "jane@example.com", "password": "wrong-password",
    })

    assert resp.status_code == 401


def test_me_requires_authentication(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401


def test_me_returns_current_user(client, auth_headers):
    resp = client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["email"] == "user@example.com"
