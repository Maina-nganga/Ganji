from flask import Flask, jsonify
from flask_cors import CORS
import logging
from config import Config
from extensions import db, jwt, migrate, bcrypt
from routes.auth import auth_bp
# import other blueprints...

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
jwt.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)

# ⚡ CORS setup
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# ⚡ Logging
logging.basicConfig(level=logging.DEBUG)

# ⚡ 422 error handler
@app.errorhandler(422)
def handle_unprocessable_entity(err):
    description = getattr(err, "description", None) or str(err)
    app.logger.debug("422 error: %s", description)
    return jsonify({"error": "unprocessable_entity", "message": description}), 422

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
# register other blueprints...

if __name__ == "__main__":
    app.run(debug=True)