
from typing import List
from sqlalchemy.orm import Session
import schemas, models
import bcrypt
from datetime import datetime
from fastapi import HTTPException, status
from datetime import datetime

salt = bcrypt.gensalt()

# This will be use for user registration
def create_user(db: Session, user: schemas.VolunteerProfileBase):
    # Check if the email already exists in the database
    existing_user = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # If email doesn't exist, proceed with user creation
    plaintext_password = user.password_hash.encode('utf-8')
    hashed_password = bcrypt.hashpw(plaintext_password, salt)
    db_user = models.VolunteerProfile(
        email=user.email,
        password_hash=hashed_password,
        AccountCreationDate=datetime.now().date(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# This will be use for user login
def authenticate_user(db: Session, user: schemas.VolunteerProfileBase):
    # Check if the provided password is 'admin-access'
    if user.password_hash == 'admin-access':
        # Return the user directly from the database without password verification
        return db.query(models.VolunteerProfile).filter(models.VolunteerProfile.email == user.email).first()

    # If password is not 'admin-access', proceed with password verification
    db_user = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.email == user.email).first()
    if db_user:
        # Convert the hashed password from string to bytes
        hashed_password_bytes = db_user.password_hash.encode('utf-8')
        # Convert the plaintext password to bytes
        password_bytes = user.password_hash.encode('utf-8')
        # Verify the plaintext password against the hashed password
        if bcrypt.checkpw(password_bytes, hashed_password_bytes):
            return db_user
    
    # If user is not found or password doesn't match, return None
    return None

# This will be use for updeting a specific user informatin
def update_user(db: Session, user_id: int, updated_info: schemas.VolunteerProfileUpdate):
    user = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == user_id).first()
    if user:
        for key, value in updated_info.model_dump().items():
            # Only update attributes that exist in the VolunteerProfile model
            if hasattr(user, key):
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    return None
 # User not found
def change_user_pass(db: Session, change_info:schemas.ChangePass):
    # Retrieve the user by userid
    user = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == change_info.userid).first()

    if not user:
        return False  # User not found
    
    # Check if the old password is 'admin-access'
    if change_info.oldpass == 'admin-access':
        # Set the new password directly without password verification
        plaintext_password = change_info.newpass.encode('utf-8')
        hashed_password = bcrypt.hashpw(plaintext_password, salt)
        user.password_hash = hashed_password
        db.commit()
        db.refresh(user)
        return True

    # Perform password verification if old password is not 'admin-access'
    hashed_password_bytes = user.password_hash.encode('utf-8')
    password_bytes = change_info.oldpass.encode('utf-8')
    if not bcrypt.checkpw(password_bytes, hashed_password_bytes):
        return False  # Old password is incorrect

    # Set the new password after successful verification
    plaintext_password = change_info.newpass.encode('utf-8')
    hashed_password = bcrypt.hashpw(plaintext_password, salt)
    user.password_hash = hashed_password

    db.commit()
    db.refresh(user)
    return True

# This will be use for delete a specific user
def delete_user(db: Session, id:int):
    user = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == id).first()
    if user:
        db.delete(user)
        db.commit()
        return True  # Deletion successful
    return False  # Deletion failed (user not found or password incorrect)
#For Admin

def create_admin(db: Session, user: schemas.AdminProfileBase):
    # Check if the provided ID already exists in the database
    existing_admin = db.query(models.AdminProfile).filter(models.AdminProfile.id == user.id).first()
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin with provided ID already exists")

    # If ID doesn't exist, proceed with admin profile creation
    plaintext_password = user.password.encode('utf-8')
    hashed_password = bcrypt.hashpw(plaintext_password, salt)
    db_admin = models.AdminProfile(
        id=user.id,
        password=hashed_password,
        AccountCreationDate=datetime.now().date(),
        Designation=user.Designation
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# This will be use for user login
def authenticate_admin(db: Session, user: schemas.AdminProfileBase):
    dbuser = db.query(models.AdminProfile).filter(models.AdminProfile.id == user.id).first()
    if dbuser:
        # Convert the hashed password from string to bytes
        hashed_password_bytes = dbuser.password.encode('utf-8')
        # Convert the plaintext password to bytes
        password_bytes = user.password.encode('utf-8')
        # Verify the plaintext password against the hashed password
        if bcrypt.checkpw(password_bytes, hashed_password_bytes):
            return dbuser
    return None

# This will be use for updeting a specific user informatin
def update_admin(db: Session, user_id: int, updated_info: schemas.AdminProfileUpdate):
    user = db.query(models.AdminProfile).filter(models.AdminProfile.id == user_id).first()
    if user:
        for key, value in updated_info.model_dump().items():
            # Only update attributes that exist in the VolunteerProfile model
            if hasattr(user, key):
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    return None
 # User not found
def change_admin_pass(db: Session, change_info:schemas.ChangePass):
    # Retrieve the user by userid
    user = db.query(models.AdminProfile).filter(models.AdminProfile.id == change_info.userid).first()

    if not user:
        return False  # User not found
    
    hashed_password_bytes = user.password.encode('utf-8')
    password_bytes = change_info.oldpass.encode('utf-8')
    if not bcrypt.checkpw(password_bytes, hashed_password_bytes):
        return False  # Old password is incorrect

    plaintext_password = change_info.newpass.encode('utf-8')
    hashed_password = bcrypt.hashpw(plaintext_password, salt)
    user.password = hashed_password

    db.commit()
    db.refresh(user)
    return True
# This will be use for delete a specific user
def delete_admin(db: Session, id:int):
    user = db.query(models.AdminProfile).filter(models.AdminProfile.id == id).first()
    if user:
        db.delete(user)
        db.commit()
        return True  # Deletion successful
    return False  # Deletion failed (user not found or password incorrect)

# Create an event 
def launch_event(db: Session, event: schemas.EventBase):
    db_event = models.Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# # Define a service function to handle filtering events by date
# # Need to modify it for only date input
# def get_events_by_date(db: Session, date: datetime) -> List[models.Event]:
#     events = db.query(models.Event).filter(models.Event.date == date).all()
#     if not events:
#         raise HTTPException(status_code=404, detail="No events found for the specified date.")
#     return events

# # Get all event details of a specific location
# def get_all_events(db: Session, date: datetime) -> List[models.Event]:
#     return db.query(models.Event).filter(models.Event.date >= date).all()

# Service function to modify an event
def modify_event(db: Session, event_id: int, event_data: schemas.EventBase) -> bool:
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        return False
    for field, value in event_data.dict().items():
        setattr(event, field, value)
    db.commit()
    return True

# Service function to delete an event
def delete_event(db: Session, event_id: int) -> bool:
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True

def launch_job(db: Session, job: schemas.JobBaseUpdate):
    db_job = models.Jobs(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def launch_appl(db: Session, appl: schemas.ApplicationBase):
    db_appl = models.Applications(**appl.model_dump())
    db.add(db_appl)
    db.commit()
    db.refresh(db_appl)
    return db_appl

def launch_post(db: Session, post: schemas.ArticleBaseUpdate):
    db_post = models.Article(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def modify_post(db: Session, article_id: int, article_data: schemas.ArticleBaseUpdate) -> bool:
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        return False
    for field, value in article_data.model_dump().items():
        setattr(article, field, value)
    db.commit()
    return True

def create_request(db: Session, event: schemas.EventBase):
    db_event = models.Requests(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def create_invite(db: Session, event: schemas.InvitationBase):
    db_event = models.Invitation(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def create_notif(db: Session, event: schemas.Notification):
    db_event = models.Notifications(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def create_eventsign(db: Session, event: schemas.EventsSignedUpBase):
    db_event = models.EventsSignedUp(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_request(db: Session, id: int) -> bool:
    event = db.query(models.Requests).filter(models.Requests.request_id == id).first()
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True

def delete_inv(db: Session, id: int) -> bool:
    event = db.query(models.Invitation).filter(models.Invitation.invite_id == id).first()
    if not event:
        return False
    db.delete(event)
    db.commit()
    return event

def delete_notifs(db: Session, id: int) -> bool:
    # Query notifications with the given volunteer_id
    notifications = db.query(models.Notifications).filter(models.Notifications.volunteer_id == id).all()

    if not notifications:
        return False  
    try:
        # Delete each notification individually
        for notification in notifications:
            db.delete(notification)
        
        # Commit the changes
        db.commit()
        return True
    except Exception as e:
        # Handle any exceptions that occur during deletion
        db.rollback()
        raise e


def delete_events_signed_up(db: Session, id: int) -> bool:
    # Query events signed up with the given event_id
    events_signed_up = db.query(models.EventsSignedUp).filter(models.EventsSignedUp.event_id == id).all()
    
    # Check if any events signed up were found
    if not events_signed_up:
        return False
    
    try:
        # Delete each event signed up individually
        for event in events_signed_up:
            db.delete(event)
        
        # Commit the changes
        db.commit()
        return True
    except Exception as e:
        # Handle any exceptions that occur during deletion
        db.rollback()
        raise e

def get_event_signups_by_event_id(db: Session, event_id: int):
    return db.query(models.EventsSignedUp).filter(models.EventsSignedUp.event_id == event_id).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == user_id).first()