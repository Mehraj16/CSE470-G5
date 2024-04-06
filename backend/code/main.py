
from datetime import datetime
from fastapi import FastAPI, HTTPException,  Depends,status,APIRouter
import schemas, models, services
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import List 
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This will be use for user registration
@app.post("/register/", response_model=schemas.VolunteerProfile)
def register_user(user: schemas.VolunteerProfileBase, db: Session = Depends(get_db)):
    try:
        db_user = services.create_user(db, user)
        return db_user
    except ValueError as e:  # Catching the error raised from create_user
        raise HTTPException(status_code=400, detail=str(e))

# This will be use for user login

@app.post("/user_login/", response_model=schemas.VolunteerProfile)   
def login(user: schemas.VolunteerProfileBase, db: Session = Depends(get_db)):
    db_user = services.authenticate_user(db, user)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return db_user


# This will be use for updeting a specific user informatin  
@app.put("/update-account/{user_id}")
def update_account(user_id: int, updated_info: schemas.VolunteerProfileUpdate, db: Session = Depends(get_db)):
    updated_user = services.update_user(db, user_id, updated_info)
    if updated_user:
        return updated_user
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
@app.put("/change-pass/")
def change_pass(change_info: schemas.ChangePass, db: Session = Depends(get_db)):
    if services.change_user_pass(db, change_info):
        return {"message": "Password changed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to change password.",
        )
# This will be use for delete a specific user
@app.delete("/delete-account/{id}")
def delete_account(id:int, db: Session = Depends(get_db)):
    if services.delete_user(db, id):
        return {"message": "Account deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete account. Check email and password.",
        )
@app.get("/images/{image_id}/")
async def get_image(image_id: int, db: Session = Depends(get_db)):
    # Retrieve image data from database
    image = db.query(models.AdminProfile).filter(models.AdminProfile.id == image_id).first()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return image

# Define an APIRouter instance
router = APIRouter()   

@router.get("/users/")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.VolunteerProfile).all()

# Create an event 
@router.post("/events/", response_model=schemas.Event)
def create_event(event: schemas.EventBase, db: Session = Depends(get_db)):
    return services.launch_event(db, event)

# Get all event details  
@router.get("/events/")
def get_all_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

# Get all event details of a specific date 
# Need to modify it for only date input
# @router.get("/events/date/", response_model=List[schemas.EventSchema])
# def get_events_by_date_endpoint(date: datetime, db: Session = Depends(get_db)):
#     return services.get_events_by_date(db, date)

# # Get all event details of a specific location
# @router.get("/events/location/", response_model=List[schemas.EventSchema])
# def get_events_by_location_endpoint(location: str, db: Session = Depends(get_db)):
#     events = services.get_events_by_location(db, location)
#     if not events:
#         raise HTTPException(status_code=404, detail="No events found for the specified location.")
#     return events

# Endpoint to modify an event details
@router.put("/events/{event_id}")
def modify_event_endpoint(event_id: int, event_data: schemas.EventBase, db: Session = Depends(get_db)):
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

#Admin
@router.post("/admin/register/", response_model=schemas.AdminProfile)
def register_user(user: schemas.AdminProfileCreate, db: Session = Depends(get_db)):
    try:
        db_user = services.create_admin(db, user)
        return db_user
    except ValueError as e:  # Catching the error raised from create_user
        raise HTTPException(status_code=400, detail=str(e))

# This will be use for user login

@router.post("/admin/user_login/", response_model=schemas.AdminProfile)   
def login(user: schemas.AdminProfileBase, db: Session = Depends(get_db)):
    db_user = services.authenticate_admin(db, user)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return db_user


# This will be use for updeting a specific user informatin  
@router.put("/admin/update-account/{user_id}")
def update_account(user_id: int, updated_info: schemas.AdminProfileUpdate, db: Session = Depends(get_db)):
    updated_user = services.update_admin(db, user_id, updated_info)
    if updated_user:
        return updated_user
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
@router.put("/change-pass/")
def change_pass(change_info: schemas.ChangePass, db: Session = Depends(get_db)):
    if services.change_admin_pass(db, change_info):
        return {"message": "Password changed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to change password."
        )

# This will be use for delete a specific user
@router.delete("/admin/delete-account/{id}")
def delete_account(id:int, db: Session = Depends(get_db)):
    if services.delete_admin(db, id):
        return {"message": "Account deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete account.",
        )
@router.get("/admins/")
def get_all_admins(db: Session = Depends(get_db)):
    return db.query(models.AdminProfile).all()

    
@router.post("/jobs/", response_model=schemas.Job)
def create_job(job: schemas.JobBaseUpdate, db: Session = Depends(get_db)):
    return services.launch_job(db, job)

@router.get("/jobs/")
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(models.Jobs).all()

@router.post("/post/", response_model=schemas.Article)
def create_post(post: schemas.ArticleBaseUpdate, db: Session = Depends(get_db)):
    return services.launch_post(db, post)

@router.get("/posts/")
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(models.Article).all()

@router.put("/posts/{post_id}")
def modify_post_endpoint(post_id: int, post_data: schemas.ArticleBase, db: Session = Depends(get_db)):
    modified = services.modify_post(db, post_id, post_data)
    if not modified:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post modified successfully"}

@router.post("/requests/", response_model=schemas.Request)
def create_req(event: schemas.RequestBase, db: Session = Depends(get_db)):
    return services.create_request(db, event)

@router.get("/requests/", response_model=List[schemas.Request])
def get_req(db: Session = Depends(get_db)):
    return db.query(models.Requests).all()

@router.delete("/remove-requests/{id}")
def delete_request(id: int, db: Session = Depends(get_db)):
    if services.delete_request(db, id):
        return {"message": "Request deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete account.",
        )


@router.post("/invitations/", response_model=schemas.Invitation)
def create_inv(event: schemas.InvitationBase, db: Session = Depends(get_db)):
    return services.create_invite(db, event)

@router.get("/invitations/", response_model=List[schemas.Invitation])
def get_inv(db: Session = Depends(get_db)):
    return db.query(models.Invitation).all()

@router.post("/notifications/", response_model=schemas.NotificationBase)
def create_notif(event: schemas.Notification, db: Session = Depends(get_db)):
    return services.create_notif(db, event)

@router.post("/events-signed-up/", response_model=schemas.EventsSignedUp)
def create_eventsign(event: schemas.EventsSignedUpBase, db: Session = Depends(get_db)):
    return services.create_eventsign(db, event)

@router.get("/events-signed-up/")
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(models.EventsSignedUp).all()

@router.post("/events-volunteered/", response_model=schemas.EventsVolunteered)
def create_eventsign(event: schemas.EventsVolunteeredBase, db: Session = Depends(get_db)):
    return services.create_eventsign(db, event)

@router.get("/events-volunteered/")
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(models.EventsVolunteered).all()
# Include the router in the main application
app.include_router(router, prefix="/api")