
from typing import List
from jose import jwt, JWTError
from sqlalchemy.orm import Session
import schemas, models
from database import get_db
from passlib.hash import bcrypt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer




SECRET_KEY = "fyuufyaufiyaiyufoioyufdaaaaaa"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Adjust token expiration as needed

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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



# Function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to authenticate user
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return False
    return user

# Function to create access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to get current user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if user is None:
        raise credentials_exception
    return user





# This will be use for user login
# def authenticate_user(db: Session, email: str, password: str):
#     user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
#     if user and bcrypt.verify(password, user.password_hash):
#         return user
#     return None


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

#fetch the user name
def get_user_name_by_email(db: Session, email: str):
    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if user:
        return user.username
    return None


# fetch user's pending and accepted events by email
def get_user_events_by_email(db: Session, email: str):
    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if not user:
        return None
    return user.user_events if user.user_events else []

# fetch event details by event id 
def get_event_by_id(db: Session, event_id: int):
    return db.query(models.EventPublishModel).filter(models.EventPublishModel.id == event_id).first()

# Function to accept an event
def accept_event(db: Session, user_id: int, event_id: int):
    user_event = db.query(models.UserEventModel).filter(
        models.UserEventModel.user_id == user_id,
        models.UserEventModel.event_id == event_id
    ).first()

    if not user_event:
        raise HTTPException(status_code=404, detail="Event not found for the user")

    # Update event_status to 'accepted'
    user_event.event_status = "accepted"
    db.commit()
    return user_event

# Function to reject an event
def reject_event(db: Session, user_id: int, event_id: int):
    user_event = db.query(models.UserEventModel).filter(
        models.UserEventModel.user_id == user_id,
        models.UserEventModel.event_id == event_id
    ).first()

    if not user_event:
        raise HTTPException(status_code=404, detail="Event not found for the user")

    # Delete the event from the table
    db.delete(user_event)
    db.commit()



#-------------------------------------------------------------------------------------------------------------------------------------