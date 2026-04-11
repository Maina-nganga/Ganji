import requests
import base64
from datetime import datetime
from flask import current_app
import os

MPESA_BASE_URL = "https://sandbox.safaricom.co.ke"   

def get_access_token():
    key = os.getenv("MPESA_CONSUMER_KEY")
    secret = os.getenv("MPESA_CONSUMER_SECRET")
    credentials = base64.b64encode(f"{key}:{secret}".encode()).decode()

    res = requests.get(
        f"{MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {credentials}"}
    )
    return res.json()["access_token"]


def generate_password():
    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{shortcode}{passkey}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp


def stk_push(phone_number, amount):
    token = get_access_token()
    password, timestamp = generate_password()
    shortcode = os.getenv("MPESA_SHORTCODE")
    callback_url = os.getenv("MPESA_CALLBACK_URL")

    
    phone = str(phone_number).strip().replace("+", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": "GanjiWallet",
        "TransactionDesc": "Wallet Deposit"
    }

    res = requests.post(
        f"{MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )
    return res.json()