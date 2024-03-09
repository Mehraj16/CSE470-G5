"""Added priority_level

Revision ID: e74f51e3b6b0
Revises: 9ba3e3464950
Create Date: 2024-03-09 06:44:41.909438

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e74f51e3b6b0'
down_revision: Union[str, None] = '9ba3e3464950'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
