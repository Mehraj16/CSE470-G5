
from datetime import datetime
from fastapi import FastAPI, HTTPException,  Depends,status,APIRouter
import schemas, models, services
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import List 

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

# This will be use for user registration
@app.post("/register/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = services.create_user(db, user)
        return db_user
    except ValueError as e:  # Catching the error raised from create_user
        raise HTTPException(status_code=400, detail=str(e))

# This will be use for user login
@app.post("/user_login/")   
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = services.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return {"message": "Login successful"}

# This will be use for updeting a specific user informatin  
@app.put("/update-account/{user_id}")
def update_account(user_id: int, updated_info: schemas.UserUpdate, db: Session = Depends(get_db)):
    updated_user = services.update_user(db, user_id, updated_info)
    if updated_user:
        return updated_user
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

# This will be use for delete a specific user
@app.delete("/delete-account/")
def delete_account(email: str, password: str, db: Session = Depends(get_db)):
    if services.delete_user(db, email, password):
        return {"message": "Account deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete account. Check email and password.",
        )

# Define an APIRouter instance
router = APIRouter()   

# Create an event 
@router.post("/events/", response_model=schemas.EventSchema)
def create_event(event: schemas.EventSchema, db: Session = Depends(get_db)):
    return services.launch_event(db, event)

# Get all event details  
@router.get("/events/")
def get_all_events(db: Session = Depends(get_db)):
    return db.query(models.EventPublishModel).all()

# Get all event details of a specific date 
# Need to modify it for only date input
@router.get("/events/date/", response_model=List[schemas.EventSchema])
def get_events_by_date_endpoint(date: datetime, db: Session = Depends(get_db)):
    return services.get_events_by_date(db, date)

# Get all event details of a specific location
@router.get("/events/location/", response_model=List[schemas.EventSchema])
def get_events_by_location_endpoint(location: str, db: Session = Depends(get_db)):
    events = services.get_events_by_location(db, location)
    if not events:
        raise HTTPException(status_code=404, detail="No events found for the specified location.")
    return events

# Endpoint to modify an event details
@router.put("/events/{event_id}")
def modify_event_endpoint(event_id: int, event_data: schemas.EventSchema, db: Session = Depends(get_db)):
    modified = services.modify_event(db, event_id, event_data)
    if not modified:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event modified successfully"}

# Endpoint to delete an event
@router.delete("/events/{event_id}")
def delete_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    deleted = services.delete_event(db, event_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


# Include the router in the main application
app.include_router(router, prefix="/api")

#----------------------------------------------------------------------------------------------------------------

#fetch the user name

# API endpoint to fetch user's name by email
@app.get("/user/name/")
def get_user_name(email: str, db: Session = Depends(get_db)):
    user_name = services.get_user_name_by_email(db, email)
    if user_name is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user_name": user_name}