
from typing import List
from sqlalchemy.orm import Session
import schemas, models
from passlib.hash import bcrypt
from datetime import datetime
from fastapi import HTTPException



# This will be use for user registration
def create_user(db: Session, user: schemas.UserCreate):
    # Check if the email is already registered
    existing_user = db.query(models.UserModel).filter(models.UserModel.email == user.email).first()
    if existing_user:
        raise ValueError("Email already registered")

    # Hash the password
    hashed_password = bcrypt.hash(user.password)
    
    # Create the new user
    db_user = models.UserModel(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# This will be use for user login
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if user and bcrypt.verify(password, user.password_hash):
        return user
    return None


# This will be use for updeting a specific user informatin
def update_user(db: Session, user_id: int, updated_info: schemas.UserUpdate):
    user = db.query(models.UserModel).filter(models.UserModel.id == user_id).first()
    if user:
        for key, value in updated_info.dict().items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    return None  # User not found

# This will be use for delete a specific user
def delete_user(db: Session, email: str, password: str):
    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if user and bcrypt.verify(password, user.password_hash):
        db.delete(user)
        db.commit()
        return True  # Deletion successful
    return False  # Deletion failed (user not found or password incorrect)

# Create an event 
def launch_event(db: Session, event: schemas.EventSchema):
    db_event = models.EventPublishModel(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Define a service function to handle filtering events by date
# Need to modify it for only date input
def get_events_by_date(db: Session, date: datetime) -> List[models.EventPublishModel]:
    events = db.query(models.EventPublishModel).filter(models.EventPublishModel.date == date).all()
    if not events:
        raise HTTPException(status_code=404, detail="No events found for the specified date.")
    return events

# Get all event details of a specific location
def get_events_by_location(db: Session, location: str) -> List[models.EventPublishModel]:
    return db.query(models.EventPublishModel).filter(models.EventPublishModel.location == location).all()

# Service function to modify an event
def modify_event(db: Session, event_id: int, event_data: schemas.EventSchema) -> bool:
    event = db.query(models.EventPublishModel).filter(models.EventPublishModel.id == event_id).first()
    if not event:
        return False
    for field, value in event_data.dict().items():
        setattr(event, field, value)
    db.commit()
    return True

# Service function to delete an event
def delete_event(db: Session, event_id: int) -> bool:
    event = db.query(models.EventPublishModel).filter(models.EventPublishModel.id == event_id).first()
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True

