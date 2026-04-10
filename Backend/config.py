from datetime import timedelta
import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///ganji.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

   
    MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY", "t7A3***")
    MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET", "05mQ***")
    MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE", "")
    MPESA_PASSKEY = os.getenv("MPESA_PASSKEY", "")
    MPESA_BASE_URL = os.getenv(
        "MPESA_BASE_URL", "https://sandbox.safaricom.co.ke"
    )

    
    MPESA_CALLBACK_URL = os.getenv(
        "MPESA_CALLBACK_URL",
        "https://grapple-cultivate-squealing.ngrok-free.dev/api/wallet/mpesa/callback"
    )