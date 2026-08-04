"""
Shared pytest fixtures for the Ganji backend test suite.

Each test gets a fresh Flask app wired to an in-memory SQLite database,
so tests never touch your real dev/prod database and are fully isolated
from one another.
"""
import os
import sys

# Make `Backend/` importable the same way app.py expects (e.g. `from config import Config`)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("JWT_SECRET_KEY", "test-jwt-secret")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

import pytest

from app import app as flask_app
from extensions import db as _db


@pytest.fixture()
def app():
    flask_app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        JWT_SECRET_KEY="test-jwt-secret",
    )

    with flask_app.app_context():
        _db.create_all()
        yield flask_app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def db(app):
    return _db


def register_and_login(client, email="user@example.com", password="password123", full_name="Test User"):
    """Helper: registers a user and returns (user_json_or_none, access_token)."""
    client.post("/api/auth/register", json={
        "full_name": full_name,
        "email": email,
        "password": password,
    })
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    token = resp.get_json()["access_token"]
    return token


@pytest.fixture()
def auth_headers(client):
    token = register_and_login(client)
    return {"Authorization": f"Bearer {token}"}
