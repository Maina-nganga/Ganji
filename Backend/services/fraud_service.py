class FraudService:

    @staticmethod
    def calculate_risk(amount):
        risk = 0
        if amount > 10000:
            risk += 40
        return risk
