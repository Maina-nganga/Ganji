from flask import Flask
from config import Config
from extensions import db, jwt, migrate, bcrypt, cors

from routes.auth import auth_bp
from routes.wallet import wallet_bp
from routes.transaction import transaction_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(wallet_bp, url_prefix="/api/wallet")
    app.register_blueprint(transaction_bp, url_prefix="/api/transactions")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
