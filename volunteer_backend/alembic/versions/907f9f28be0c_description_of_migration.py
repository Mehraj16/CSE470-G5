"""description_of_migration

Revision ID: 907f9f28be0c
Revises: e74f51e3b6b0
Create Date: 2024-04-05 23:34:29.807579

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '907f9f28be0c'
down_revision: Union[str, None] = 'e74f51e3b6b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
