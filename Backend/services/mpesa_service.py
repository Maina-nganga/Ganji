import requests
import base64
from datetime import datetime
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

    if res.status_code != 200:
        raise Exception(f"M-Pesa auth failed: {res.status_code} - {res.text}")

    return res.json()["access_token"]


def generate_password():
    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{shortcode}{passkey}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp


def format_phone(phone_number):
    phone = str(phone_number).strip().replace("+", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    return phone


def stk_push(phone_number, amount):
    token = get_access_token()
    password, timestamp = generate_password()
    shortcode = os.getenv("MPESA_SHORTCODE")
    callback_url = os.getenv("MPESA_CALLBACK_URL")
    phone = format_phone(phone_number)

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": f"{callback_url}/deposit",
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


def b2c_payment(phone_number, amount):
    token = get_access_token()
    shortcode = os.getenv("MPESA_SHORTCODE")
    initiator_name = os.getenv("MPESA_INITIATOR_NAME", "testapi")
    initiator_password = os.getenv("MPESA_INITIATOR_PASSWORD", "Safaricom999!*!")
    callback_url = os.getenv("MPESA_CALLBACK_URL")
    phone = format_phone(phone_number)

    
    cert_path = os.path.join(os.path.dirname(__file__), "sandbox_cert.cer")
    with open(cert_path, "rb") as f:
        from cryptography.hazmat.primitives.asymmetric import padding
        from cryptography.x509 import load_pem_x509_certificate
        cert = load_pem_x509_certificate(f.read())
        pub_key = cert.public_key()
        encrypted = pub_key.encrypt(
            initiator_password.encode(),
            padding.PKCS1v15()
        )
        security_credential = base64.b64encode(encrypted).decode()

    payload = {
        "InitiatorName": initiator_name,
        "SecurityCredential": security_credential,
        "CommandID": "BusinessPayment",
        "Amount": int(amount),
        "PartyA": shortcode,
        "PartyB": phone,
        "Remarks": "Wallet Withdrawal",
        "QueueTimeOutURL": f"{callback_url}/timeout",
        "ResultURL": f"{callback_url}/withdraw",
        "Occasion": "Withdrawal"
    }

    res = requests.post(
        f"{MPESA_BASE_URL}/mpesa/b2c/v3/paymentrequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )
    return res.json()