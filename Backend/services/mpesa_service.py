import requests
import base64
from datetime import datetime
from flask import current_app


class MpesaService:

    @staticmethod
    def get_access_token():
        key = current_app.config["t7A338YLDnUWcqWXQwCOfzABSeO55hRn2ppOOOLJbOWnsq8q"]
        secret = current_app.config["05mQ13i6RIXqNsomuZCpRxAOFYpWsAIRIYjy4mARNtmTVAeNJ5wcgNfFFbKqmKLh"]

        credentials = base64.b64encode(f"{key}:{secret}".encode()).decode()

        url = f"{current_app.config['MPESA_BASE_URL']}/oauth/v1/generate?grant_type=client_credentials"

        res = requests.get(
            url,
            headers={"Authorization": f"Basic {credentials}"}
        )

        return res.json().get("access_token")

    @staticmethod
    def stk_push(phone, amount, account_reference):
        token = MpesaService.get_access_token()

        shortcode = current_app.config["MPESA_SHORTCODE"]
        passkey = current_app.config["MPESA_PASSKEY"]

        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        password = base64.b64encode(
            f"{shortcode}{passkey}{timestamp}".encode()
        ).decode()

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone,
            "PartyB": shortcode,
            "PhoneNumber": phone,
            "CallBackURL": current_app.config["https://grapple-cultivate-squealing.ngrok-free.dev/api/wallet/mpesa/callback"],
            "AccountReference": account_reference,
            "TransactionDesc": "Wallet Deposit"
        }

        res = requests.post(
            f"{current_app.config['MPESA_BASE_URL']}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"}
        )

        return res.json()