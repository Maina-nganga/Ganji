"""empty message

Revision ID: 4982aa22119f
Revises: 
Create Date: 2026-03-02 15:49:01.299664

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4982aa22119f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=120), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=200), nullable=False),
    sa.Column('role', sa.String(length=50), nullable=True),
    sa.Column('kyc_status', sa.String(length=50), nullable=True),
    sa.Column('account_status', sa.String(length=50), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('reference', sa.String(length=120), nullable=True),
    sa.Column('type', sa.String(length=50), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('amount', sa.Float(), nullable=True),
    sa.Column('sender_id', sa.Integer(), nullable=True),
    sa.Column('receiver_id', sa.Integer(), nullable=True),
    sa.Column('risk_score', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('reference')
    )
    op.create_table('ledger_account',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('type', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ledger_entries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=True),
    sa.Column('transaction_id', sa.Integer(), nullable=True),
    sa.Column('debit', sa.Float(), nullable=True),
    sa.Column('credit', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['account_id'], ['ledger_account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('beneficiaries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('account', sa.String(length=100), nullable=False),
    sa.Column('bank', sa.String(length=100), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('audit_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('action', sa.String(length=255), nullable=True),
    sa.Column('ip_address', sa.String(length=100), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('audit_log')
    op.drop_table('beneficiaries')
    op.drop_table('ledger_entries')
    op.drop_table('ledger_account')
    op.drop_table('transaction')
    op.drop_table('users')  