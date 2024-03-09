"""Add priority_level column

Revision ID: 9ba3e3464950
Revises: 877211728868
Create Date: 2024-03-09 06:37:27.772506

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9ba3e3464950'
down_revision: Union[str, None] = '877211728868'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # add priority_level column to users table
    op.add_column('users', sa.Column('priority_level', sa.Integer, nullable=True))

def downgrade() -> None:
    # remove priority_level column from users table
    op.drop_column('users', 'priority_level')
