from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, TIMESTAMP, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import func

Base = declarative_base()

class VolunteerProfile(Base):
    __tablename__ = "volunteer_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    firstName = Column(String(50), nullable=True)
    lastName = Column(String(50), nullable=True)
    dob = Column(Date, nullable=True)
    city = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(100), nullable=False)
    blood = Column(String(5), nullable=True)
    gender = Column(String(10), nullable=True)
    biography = Column(String(300), nullable=True)
    lifetimeScore = Column(Integer, default=0, nullable=True)
    totalMedals = Column(Integer, default=0, nullable=True)
    eventCount = Column(Integer, default=0, nullable=True)
    interests = Column(String(200), nullable=True)
    skills = Column(String(200), nullable=True)
    profileImage = Column(LargeBinary, nullable=True)
    AccountCreationDate = Column(Date, nullable=False)

    # Define relationships
    signed_up_events = relationship("EventsSignedUp", back_populates="volunteer")
    volunteered_events = relationship("EventsVolunteered", back_populates="volunteer")
    requests = relationship("Requests", back_populates="volunteer")
    invitations = relationship("Invitation", back_populates="volunteer")
    mvv = relationship("MVV", back_populates="volunteer_profile")
    leaderboard = relationship("Leaderboard", back_populates="volunteer_profile")
    suggested = relationship("Suggested", back_populates="volunteer_profile")
    applications = relationship("Applications", back_populates="volunteer_profile")
    notifications = relationship("Notifications", back_populates="volunteer_profile")

class AdminProfile(Base):
    __tablename__ = "admin_profiles"

    id = Column(Integer, primary_key=True)
    firstName = Column(String(50), nullable=True)
    lastName = Column(String(50), nullable=True)
    dob = Column(Date, nullable=True)
    city = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    password = Column(String(100), nullable=False)
    blood = Column(String(5), nullable=True)
    gender = Column(String(10), nullable=True)
    biography = Column(String(500), nullable=True)
    profileImage = Column(LargeBinary, nullable=True)
    AccountCreationDate = Column(Date, nullable=False)
    Designation = Column(String(100), nullable=False)

    # Define relationships
    signed_up_events = relationship("EventsSignedUp", back_populates="admin")
    requests = relationship("Requests", back_populates="admin")
    invitations = relationship("Invitation", back_populates="admin")
    events = relationship("Event", back_populates="admin")
    articles = relationship("Article", back_populates="admin")
    jobs = relationship("Jobs", back_populates="admin")
    applications = relationship("Applications", back_populates="admin")
    notifications = relationship("Notifications", back_populates="admin")

class Jobs(Base):
    __tablename__ = 'jobs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    positionTitle = Column(String(100))
    description = Column(String(500))
    deadline = Column(Date)
    banner_image = Column(LargeBinary)
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))

    # Define relationship with AdminProfile
    admin = relationship("AdminProfile", back_populates="jobs")

    # Define relationship with Applications
    applications = relationship("Applications", back_populates="job")

class Article(Base):
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date)
    title = Column(String(100))
    article = Column(LargeBinary)
    banner_image = Column(LargeBinary)
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))

    # Define relationship with AdminProfile
    admin = relationship("AdminProfile", back_populates="articles")

class Applications(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))
    job_id = Column(Integer, ForeignKey('jobs.id'))
    resume = Column(LargeBinary)
    date = Column(Date)

    # Define relationship with Jobs
    job = relationship("Jobs", back_populates="applications")

    # Define relationship with AdminProfile
    admin = relationship("AdminProfile", back_populates="applications")

    # Define relationship with VolunteerProfile
    volunteer_profile = relationship("VolunteerProfile", back_populates="applications")

class Notifications(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True)
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))
    Message = Column(String(200))

    # Define relationship with VolunteerProfile
    volunteer_profile = relationship("VolunteerProfile", back_populates="notifications")

    # Define relationship with AdminProfile
    admin = relationship("AdminProfile", back_populates="notifications")

class MVV(Base):
    __tablename__ = 'mvv'

    id = Column(Integer, ForeignKey('volunteer_profiles.id'), primary_key=True)

    volunteer_profile = relationship("VolunteerProfile", back_populates="mvv")

class Leaderboard(Base):
    __tablename__ = 'leaderboard'

    id = Column(Integer, ForeignKey('volunteer_profiles.id'), primary_key=True)
    monthlyScore = Column(Integer)

    volunteer_profile = relationship("VolunteerProfile", back_populates="leaderboard")

class Suggested(Base):
    __tablename__ = 'suggested'

    id = Column(Integer, primary_key=True)
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))
    event_id = Column(Integer, ForeignKey('events.id'))

    # Define relationship with Event
    event = relationship("Event", back_populates="suggestions")
    volunteer_profile = relationship("VolunteerProfile", back_populates="suggested")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))
    title = Column(String(100), nullable=False)
    description = Column(String(500))
    banner_image = Column(LargeBinary)
    rewards = Column(Integer, default=0, nullable=True)
    time = Column(String(10)) 
    date = Column(Date)
    location = Column(String(255))

    # Define relationship
    requests = relationship("Requests", back_populates="event")
    invitations = relationship("Invitation", back_populates="event")
    signups = relationship("EventsSignedUp", back_populates="event")
    volunteers = relationship("EventsVolunteered", back_populates="event")
    admin = relationship("AdminProfile", back_populates="events")
    suggestions = relationship("Suggested", back_populates="event")

class Requests(Base):
    __tablename__ = "requests"

    request_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))
    event_id = Column(Integer, ForeignKey('events.id'))
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))
    volunteer_email = Column(String(100))

    # Define relationships
    admin = relationship("AdminProfile", back_populates="requests")
    event = relationship("Event", back_populates="requests")
    volunteer = relationship("VolunteerProfile", back_populates="requests")

class Invitation(Base):
    __tablename__ = "invitations"

    invite_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))
    event_id = Column(Integer, ForeignKey('events.id'))
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))

    # Define relationships
    admin = relationship("AdminProfile", back_populates="invitations")
    event = relationship("Event", back_populates="invitations")
    volunteer = relationship("VolunteerProfile", back_populates="invitations")

class EventsSignedUp(Base):
    __tablename__ = "events_signed_up"

    event_signed_id = Column(Integer, primary_key=True, autoincrement=True)
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))
    event_id = Column(Integer, ForeignKey('events.id'))
    event_date = Column(Date)
    admin_id = Column(Integer, ForeignKey('admin_profiles.id'))
    
    # Define relationships
    volunteer = relationship("VolunteerProfile", back_populates="signed_up_events")
    event = relationship("Event", back_populates="signups")
    admin = relationship("AdminProfile", back_populates="signed_up_events")

class EventsVolunteered(Base):
    __tablename__ = "events_volunteered"

    event_volunteer_id = Column(Integer, primary_key=True, autoincrement=True)
    volunteer_id = Column(Integer, ForeignKey('volunteer_profiles.id'))
    event_id = Column(Integer, ForeignKey('events.id'))
    event_date = Column(Date)
    
    # Define relationships
    volunteer = relationship("VolunteerProfile", back_populates="volunteered_events")
    event = relationship("Event", back_populates="volunteers")
