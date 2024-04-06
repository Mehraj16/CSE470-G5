"""Initial migration

Revision ID: 767a5d796115
Revises: 
Create Date: 2024-04-05 19:04:42.758138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '767a5d796115'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admin_profiles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('firstName', sa.String(length=50), nullable=True),
    sa.Column('lastName', sa.String(length=50), nullable=True),
    sa.Column('dob', sa.Date(), nullable=True),
    sa.Column('city', sa.String(length=100), nullable=True),
    sa.Column('email', sa.String(length=100), nullable=True),
    sa.Column('password', sa.String(length=100), nullable=False),
    sa.Column('blood', sa.String(length=5), nullable=True),
    sa.Column('gender', sa.String(length=10), nullable=True),
    sa.Column('biography', sa.Text(), nullable=True),
    sa.Column('profileImage', sa.LargeBinary(), nullable=True),
    sa.Column('AccountCreationDate', sa.Date(), nullable=False),
    sa.Column('Designation', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('volunteer_profiles',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('firstName', sa.String(length=50), nullable=True),
    sa.Column('lastName', sa.String(length=50), nullable=True),
    sa.Column('dob', sa.Date(), nullable=True),
    sa.Column('city', sa.String(length=100), nullable=True),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password_hash', sa.String(length=100), nullable=False),
    sa.Column('blood', sa.String(length=5), nullable=True),
    sa.Column('gender', sa.String(length=10), nullable=True),
    sa.Column('biography', sa.Text(), nullable=True),
    sa.Column('lifetimeScore', sa.Integer(), nullable=True),
    sa.Column('totalMedals', sa.Integer(), nullable=True),
    sa.Column('eventCount', sa.Integer(), nullable=True),
    sa.Column('interests', sa.Text(), nullable=True),
    sa.Column('skills', sa.Text(), nullable=True),
    sa.Column('profileImage', sa.LargeBinary(), nullable=True),
    sa.Column('AccountCreationDate', sa.Date(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('articles',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('title', sa.String(length=100), nullable=True),
    sa.Column('article', sa.LargeBinary(), nullable=True),
    sa.Column('banner_image', sa.LargeBinary(), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('events',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('banner_image', sa.LargeBinary(), nullable=True),
    sa.Column('rewards', sa.Integer(), nullable=True),
    sa.Column('time', sa.String(length=10), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('location', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('jobs',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=100), nullable=True),
    sa.Column('positionTitle', sa.String(length=50), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('deadline', sa.Date(), nullable=True),
    sa.Column('banner_image', sa.LargeBinary(), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('leaderboard',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('monthlyScore', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mvv',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.Column('Message', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('applications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=True),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.Column('job_id', sa.Integer(), nullable=True),
    sa.Column('resume', sa.LargeBinary(), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('events_signed_up',
    sa.Column('event_signed_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('event_date', sa.Date(), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('event_signed_id')
    )
    op.create_table('events_volunteered',
    sa.Column('event_volunteer_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('event_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('event_volunteer_id')
    )
    op.create_table('invitations',
    sa.Column('invite_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('invite_id')
    )
    op.create_table('requests',
    sa.Column('request_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.Column('volunteer_email', sa.String(length=100), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_profiles.id'], ),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('request_id')
    )
    op.create_table('suggested',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('volunteer_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteer_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('suggested')
    op.drop_table('requests')
    op.drop_table('invitations')
    op.drop_table('events_volunteered')
    op.drop_table('events_signed_up')
    op.drop_table('applications')
    op.drop_table('notifications')
    op.drop_table('mvv')
    op.drop_table('leaderboard')
    op.drop_table('jobs')
    op.drop_table('events')
    op.drop_table('articles')
    op.drop_table('volunteer_profiles')
    op.drop_table('admin_profiles')
    # ### end Alembic commands ###
