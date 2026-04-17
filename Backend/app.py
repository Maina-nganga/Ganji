from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
import logging
from config import Config
from extensions import db, jwt, migrate, bcrypt
from routes.auth import auth_bp
from routes.wallet import wallet_bp
from routes.transaction import transaction_bp
from routes.mpesa import mpesa_bp
from routes.Beneficiaries import Beneficiaries_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
jwt.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)

CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
)

logging.basicConfig(level=logging.DEBUG)

@app.errorhandler(422)
def handle_unprocessable_entity(err):
    description = getattr(err, "description", None) or str(err)
    app.logger.debug("422 error: %s", description)
    return jsonify({"error": "unprocessable_entity", "message": description}), 422

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(wallet_bp, url_prefix="/api/wallet")
app.register_blueprint(transaction_bp, url_prefix="/api/transactions")
app.register_blueprint(mpesa_bp, url_prefix="/api/mpesa")
app.register_blueprint(Beneficiaries_bp, url_prefix="/api/beneficiaries")

if __name__ == "__main__":
    app.run(debug=True)