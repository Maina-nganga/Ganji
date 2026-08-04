# Ganji 

A mobile-money wallet application modeled on M-Pesa, built with a Flask REST API and a React frontend. Ganji supports user wallets, peer-to-peer transfers, M-Pesa STK Push/paybill/till deposits and withdrawals, beneficiary management, and double-entry ledger accounting for transaction integrity.

**Live demo:** [ganji1.netlify.app](https://ganji1.netlify.app/)

---

## Features

- **Authentication** — JWT-based register/login with hashed passwords (Flask-Bcrypt)
- **Wallets** — balance lookups, deposits, and withdrawals per user
- **Transfers** — peer-to-peer transactions with transaction history, monthly trends, and summaries
- **M-Pesa integration** — STK Push, Pay Till, Pay Paybill, withdrawals, and callback handling for deposit/withdraw/timeout events
- **Double-entry ledger** — every transaction posts debit/credit entries to a `LedgerAccount`, so balances are derived from an auditable ledger rather than a single mutable field
- **Beneficiaries** — save and manage frequent transfer recipients
- **Audit logging** — user actions are recorded with IP and timestamp
- **Risk scoring** — transactions carry a `risk_score` field for fraud-detection logic

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Framer Motion, Recharts, Axios |
| Backend | Flask, Flask-SQLAlchemy, Flask-Migrate (Alembic), Flask-JWT-Extended, Flask-Bcrypt |
| Database | MySQL (PyMySQL) in production, SQLite by default in dev |
| Deployment | Netlify (frontend), Gunicorn-ready backend |

## Project structure

```
Ganji/
├── Backend/
│   ├── app.py              # App factory, blueprint registration, CORS config
│   ├── config.py           # Environment-driven configuration
│   ├── extensions.py       # db, jwt, migrate, bcrypt instances
│   ├── models/              # SQLAlchemy models (User, Transaction, Ledger, Beneficiary, AuditLog)
│   ├── routes/              # Blueprints: auth, wallet, transaction, mpesa, beneficiaries, users
│   ├── services/             # Business logic: fraud detection, ledger posting, M-Pesa client
│   ├── migrations/          # Alembic migration history
│   └── requirements.txt
└── Frontend/
    ├── src/
    │   ├── Pages/            # Landing, Login, Register, Dashboard, Wallet, Transactions, Beneficiaries, AdminDashboard
    │   ├── components/       # Navbar, Sidebar, TopBar, Card, Button, ProtectedRoute
    │   └── context/          # AuthContext
    └── package.json
```

## API overview

All endpoints are prefixed with `/api`.

| Blueprint | Prefix | Purpose |
|---|---|---|
| `auth` | `/api/auth` | Register, login, current user |
| `wallet` | `/api/wallet` | Balance, deposit, withdraw |
| `transactions` | `/api/transactions` | List, detail, transfer, monthly trend, summary |
| `mpesa` | `/api/mpesa` | STK push, till/paybill payment, withdrawal, callbacks |
| `beneficiaries` | `/api/beneficiaries` | List, add, delete saved recipients |
| `users` | `/api/users` | User search |

## Getting started

### Prerequisites
- Python 3.10+
- MySQL (optional — SQLite is used by default if `DATABASE_URL` isn't set)

### Backend setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in your own values
flask db upgrade                # apply migrations
python app.py                   # runs on http://localhost:5000
```

### Frontend setup

```bash
cd Frontend
npm install
npm run dev                     # runs on http://localhost:5173
```

### Environment variables

Create a `Backend/.env` file (see `Backend/.env.example`) with at least:

```
SECRET_KEY=
JWT_SECRET_KEY=
DATABASE_URL=                   # e.g. mysql+pymysql://user:pass@host/dbname
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=
```

## Roadmap

- [ ] Automated test coverage (backend + frontend)
- [ ] Rate limiting on auth and M-Pesa endpoints
- [ ] KYC verification flow

## License

This project currently has no license file — see `LICENSE` (to be added). Until then, all rights are reserved by the author.

## Author

Built by [Maina Ng'ang'a](https://github.com/Maina-nganga).
