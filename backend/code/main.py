
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter, File, UploadFile
import schemas, models, services
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from sqlalchemy import desc
from fastapi.staticfiles import StaticFiles
import logging
import uuid
import threading
import asyncio

logger = logging.getLogger(__name__)

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

app.mount("/articles", StaticFiles(directory="articles"), name="articles")
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

# Define an APIRouter instance
router = APIRouter()   

@router.get("/users/")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.VolunteerProfile).all()

IMAGEDIR = "profile/"

@router.get("/images/{id}")
def send_image(id: int, db: Session = Depends(get_db)):
    event = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.profileImage:
        image_path = os.path.join(IMAGEDIR, event.profileImage)
        if os.path.exists(image_path):
            return FileResponse(image_path)
        else:
            raise HTTPException(status_code=404, detail="Image not found")
    else:
        raise HTTPException(status_code=404, detail="Banner image not specified for this event")

@router.post("/upload/images/{id}")
async def upload_file(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Retrieve the original filename from the database
    volunteer = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    original_filename = volunteer.profileImage
    unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[-1]
    filepath = os.path.join(IMAGEDIR, unique_filename)

    # Check if the file already exists and delete it
    existing_filepath = f"{IMAGEDIR}{original_filename}"
    if os.path.exists(existing_filepath):
        os.remove(existing_filepath)

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    # Update the profileImage field in the database with the unique filename
    volunteer.profileImage = unique_filename
    db.commit()

    return {"message": "Image uploaded successfully and profile updated"}

#######################################END OF USER QUERIES##########################################################

EVENTDIR = "banners\events"

@router.post("/upload-event-banners/{id}")
async def upload_file(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    file_path = os.path.join(EVENTDIR, f"{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Update the event's banner filename in the database
    event.banner_image = file_path
    db.commit()
    
    return {"filename": file.filename}

# Create an event 
@router.post("/events/", response_model=schemas.Event)
def create_event(event: schemas.EventBase, db: Session = Depends(get_db)):
    return services.launch_event(db, event)

@router.get("/events/")
def get_all_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

@router.get("/event-banner/{id}")
def send_image(id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.banner_image:
        if os.path.exists(event.banner_image):
            return FileResponse(event.banner_image)
        else:
            raise HTTPException(status_code=404, detail="Image not found")
    else:
        raise HTTPException(status_code=404, detail="Banner image not specified for this event")
    
@router.get("/events-with-dates/")
def get_all_events(end_date: datetime = datetime.now(), db: Session = Depends(get_db)):
    # Filter events where date has not passed
    events = db.query(models.Event).filter(models.Event.date >= end_date).all()

    return events

@router.get("/past-dates/{admin_id}")
def get_events_signed_up(admin_id: int, end_date: datetime = datetime.now(), db: Session = Depends(get_db)):
    # Fetch events where date has passed and admin_id matches
    events = db.query(models.Event)\
               .filter(models.Event.date < end_date, models.Event.admin_id == admin_id)\
               .all()

    # If no events match the admin_id or if no events are found, return empty list
    if not events:
        return []

    # Fetch event IDs for the filtered events
    event_ids = [event.id for event in events]

    # Fetch events that appear in EventsVolunteered
    events_volunteered = db.query(models.EventsVolunteered)\
                           .filter(models.EventsVolunteered.event_id.in_(event_ids))\
                           .all()

    # Collect event IDs that appear in EventsVolunteered
    events_volunteered_ids = {event_volunteered.event_id for event_volunteered in events_volunteered}

    # Filter out events that appear in EventsVolunteered
    events = [event for event in events if event.id not in events_volunteered_ids]

    # If no events remain after filtering, return empty list
    if not events:
        return []

    # Fetch event names for the filtered event IDs
    event_names = {event.id: event.title for event in events}

    # Fetch EventsSignedUp data where event_id matches any of the collected event IDs
    events_signed_up = db.query(models.EventsSignedUp)\
                          .filter(models.EventsSignedUp.event_id.in_(event_ids))\
                          .all()

    # Collect unique volunteer IDs for each event
    event_volunteers = {event.id: set() for event in events}
    for event_signed_up in events_signed_up:
        event_volunteers[event_signed_up.event_id].add(event_signed_up.volunteer_id)

    # Fetch VolunteerProfile data for each unique volunteer ID
    volunteer_profiles = {}
    for event_id, volunteer_ids in event_volunteers.items():
        volunteer_profiles[event_id] = {}
        for volunteer_id in volunteer_ids:
            volunteer_profile = db.query(models.VolunteerProfile)\
                                   .filter(models.VolunteerProfile.id == volunteer_id)\
                                   .first()
            if volunteer_profile:
                volunteer_profiles[event_id][volunteer_id] = {
                    "id": volunteer_profile.id,
                    "firstName": volunteer_profile.firstName,
                    "lastName": volunteer_profile.lastName,
                    "email": volunteer_profile.email,
                    # Add more fields as needed
                }

    # Construct the response format
    response = []
    for event_id in event_volunteers:
        event_name = event_names.get(event_id)
        if event_name:
            event_data = {
                "event_id": event_id,
                "event_name": event_name,
                "volunteers": list(volunteer_profiles[event_id].values())
            }
            response.append(event_data)

    return response

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

#######################################END OF EVENT QUERIES##########################################################

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

ADMINDIR = "admin/"

@router.get("/admin-images/{id}")
def send_image(id: int, db: Session = Depends(get_db)):
    event = db.query(models.AdminProfile).filter(models.AdminProfile.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.profileImage:
        image_path = os.path.join(ADMINDIR, event.profileImage)
        if os.path.exists(image_path):
            return FileResponse(image_path)
        else:
            raise HTTPException(status_code=404, detail="Image not found")
    else:
        raise HTTPException(status_code=404, detail="Banner image not specified for this event")

@router.post("/upload-admin-images/{id}")
async def upload_file(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    original_filename = file.filename

    existing_filepath = f"{ADMINDIR}{original_filename}"
    if os.path.exists(existing_filepath):
        os.remove(existing_filepath)

    contents = await file.read()
    with open(existing_filepath, "wb") as f:
        f.write(contents)

    volunteer = db.query(models.AdminProfile).filter(models.AdminProfile.id == id).first()
    if volunteer:
        volunteer.profileImage = original_filename
        db.commit()
        return {"message": "Image uploaded successfully and profile updated"}
    else:
        return {"message": "Volunteer not found"}

#######################################END OF ADMIN QUERIES##########################################################       

@router.post("/jobs/", response_model=schemas.Job)
def create_job(job: schemas.JobBaseUpdate, db: Session = Depends(get_db)):
    return services.launch_job(db, job)

JOBDIR = "banners\jobs"

@router.post("/upload-job-banners/{id}")
async def upload_file(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    event = db.query(models.Jobs).filter(models.Jobs.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    file_path = os.path.join(JOBDIR, f"{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Update the event's banner filename in the database
    event.banner_image = file_path
    db.commit()
    
    return {"filename": file.filename}

@router.get("/jobs/")
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(models.Jobs).all()

@router.get("/job-banner/{id}")
def send_image(id: int, db: Session = Depends(get_db)):
    event = db.query(models.Jobs).filter(models.Jobs.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.banner_image:
        if os.path.exists(event.banner_image):
            return FileResponse(event.banner_image)
        else:
            raise HTTPException(status_code=404, detail="Image not found")
    else:
        raise HTTPException(status_code=404, detail="Banner image not specified for this event")

#######################################END OF JOB QUERIES##########################################################
@router.post("/apply/", response_model=schemas.Application)
def create_appl(appl: schemas.ApplicationBase, db: Session = Depends(get_db)):
    return services.launch_appl(db, appl)

APPDIR = "applications/"

@router.post("/upload-resume/{id}")
async def upload_file(id: int, pdf_file: UploadFile = File(...), db: Session = Depends(get_db)):
    event = db.query(models.Applications).filter(models.Applications.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    file_path = os.path.join(APPDIR, f"{pdf_file.filename}")
    with open(file_path, "wb") as f:
        f.write(await pdf_file.read())

    # Update the event's banner filename in the database
    event.resume_path = file_path
    db.commit()
    
    return {"filename": pdf_file.filename}

@router.get("/resume/{id}")
async def get_article_pdf(id: int, db: Session = Depends(get_db)):
    # Retrieve the article from the database
    article = db.query(models.Applications).filter(models.Applications.id == id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")

    # Extract the file path from the article
    file_path = article.resume_path  # Replace 'file_path' with the actual attribute name in your Article model

    # Send the PDF file as a response
    return FileResponse(file_path, media_type="application/pdf")

@router.delete("/delete-resume/{id}")
def delete_article_and_image(id: int, db: Session = Depends(get_db)):
    # Retrieve the article from the database
    article = db.query(models.Applications).filter(models.Applications.id == id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article.resume_path:
        if os.path.exists(article.resume_path):
            os.remove(article.resume_path)
    db.delete(article)
    db.commit()
    return {"message": "Application processed successfully"}

@router.get("/apps/")
def get_all_apps(db: Session = Depends(get_db)):
    return db.query(models.Applications).all()

#######################################END OF APPLICATION QUERIES##########################################################

@router.post("/article/", response_model=schemas.Article)
def create_post(post: schemas.ArticleBaseUpdate, db: Session = Depends(get_db)):
    return services.launch_post(db, post)

PDFDIR = "banners\pdf"

@router.post("/upload-article-banners/{id}")
async def upload_file(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    event = db.query(models.Article).filter(models.Article.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    file_path = os.path.join(PDFDIR, f"{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Update the event's banner filename in the database
    event.banner_image = file_path
    db.commit()
    
    return {"filename": file.filename}

UPLOAD_FOLDER = "articles"

@router.post("/upload-pdf/{id}")
async def upload_pdf(id:int, pdf_file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Ensure the upload folder exists, if not, create it
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        file_path = os.path.join(UPLOAD_FOLDER, pdf_file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await pdf_file.read())
        
        document = db.query(models.Article).filter(models.Article.id == id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        document.article = file_path
        db.commit()

        return {"message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")
    
@router.get("/posts/")
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(models.Article).all()

@router.put("/posts/{post_id}")
def modify_post_endpoint(post_id: int, post_data: schemas.ArticleBase, db: Session = Depends(get_db)):
    modified = services.modify_post(db, post_id, post_data)
    if not modified:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post modified successfully"}

@router.delete("/delete-article/{id}")
def delete_article_and_image(id: int, db: Session = Depends(get_db)):
    # Retrieve the article from the database
    article = db.query(models.Article).filter(models.Article.id == id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Delete the article
    db.delete(article)
    if article.banner_image:
        if os.path.exists(article.banner_image):
            os.remove(article.banner_image)

    if article.article:
        if os.path.exists(article.article):
            os.remove(article.article)

    db.commit()
    return {"message": "Article, associated image, and file deleted successfully"}
    
@router.get("/article-banner/{id}")
def send_image(id: int, db: Session = Depends(get_db)):
    event = db.query(models.Article).filter(models.Article.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.banner_image:
        if os.path.exists(event.banner_image):
            return FileResponse(event.banner_image)
        else:
            raise HTTPException(status_code=404, detail="Image not found")
    else:
        raise HTTPException(status_code=404, detail="Banner image not specified for this event")

@router.get("/article-pdf/{article_id}")
async def get_article_pdf(article_id: int, db: Session = Depends(get_db)):
    # Retrieve the article from the database
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")

    # Extract the file path from the article
    file_path = article.article  # Replace 'file_path' with the actual attribute name in your Article model

    # Send the PDF file as a response
    return FileResponse(file_path, media_type="application/pdf")
   
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
@router.post("/events-signed-req-notif/")
def create_eventsign_and_notification(event: schemas.EventsSignReqNotif, db: Session = Depends(get_db)):
    eventS = {
    "volunteer_id": event.volunteer_id,
    "event_id": event.event_id,
    "event_date": event.event_date,
    "admin_id": event.admin_id
    }

    created_event = services.create_eventsign(db, schemas.EventsSignedUpBase(**eventS))

    # Remove request with the specified ID
    if not services.delete_request(db, event.req_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )
    eventNot = schemas.Notification(admin_id=event.admin_id, volunteer_id=event.volunteer_id, Message=event.Message)
    services.create_notif(db, eventNot)
    return created_event

@router.post("/invite-and-notify/")
def invite_and_notify(event: schemas.InviteAndNotify, db: Session = Depends(get_db)):
    for volunteer_id in event.volunteer_ids:
        invitation_data = schemas.InvitationBase(admin_id=event.admin_id, event_id=event.event_id, volunteer_id=volunteer_id)
        services.create_invite(db, invitation_data)
    
        notification_data = schemas.Notification(admin_id=event.admin_id, volunteer_id=volunteer_id, Message=event.Message)
        services.create_notif(db, notification_data)

    return {"invitations_created"}

@router.post("/invitations/", response_model=schemas.Invitation)
def create_inv(event: schemas.InvitationBase, db: Session = Depends(get_db)):
    return services.create_invite(db, event)

@router.get("/invitations/", response_model=List[schemas.Invitation])
def get_inv(db: Session = Depends(get_db)):
    return db.query(models.Invitation).all()

@router.delete("/delete-invite/{id}")
def delete_invite(id:int, db: Session = Depends(get_db)):
        if services.delete_inv(db, id):
            return {"message": "Invitation deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Item not found")

def filter_invitations_by_user_id(invitations: List[models.Invitation], users: List[models.VolunteerProfile]):
    invited_volunteer_ids = {invitation.volunteer_id for invitation in invitations}
    return [user for user in users if user.id not in invited_volunteer_ids]

@router.get("/users_without_invites/{event_id}")
def get_users_without_invites(event_id: int, db: Session = Depends(get_db)):
    # Step 1: Retrieve all users
    all_users = db.query(models.VolunteerProfile).all()
    event_invitations = db.query(models.Invitation).filter(models.Invitation.event_id == event_id).all()
    remaining_users = filter_invitations_by_user_id(event_invitations, all_users)

    return remaining_users

#######################Creates notification for all who signed up if event is deleted and if edited, then creates notif if prompted###############
@router.post("/notifications/", response_model=schemas.NotificationBase)
def create_notif(event: schemas.Notification, db: Session = Depends(get_db)):
    return services.create_notif(db, event)

@router.post("/notifications-for-all/")
def create_notif(event: schemas.NotificationMultiple, db: Session = Depends(get_db)):
    eventId = event.id  # Assuming event_id is a single event ID
    message = event.Message

    # Retrieve all events with the given ID from the database
    events = db.query(models.EventsSignedUp).filter(models.EventsSignedUp.event_id == eventId).all()

    # Extract volunteer IDs associated with the retrieved events
    volunteer_ids = set()
    for evt in events:
        volunteer_ids.add(evt.volunteer_id)

    # Post message to each volunteer ID
    for volunteer_id in volunteer_ids:
        create_notif_all(db, event.admin_id, volunteer_id, message)

    if services.delete_events_signed_up(db, eventId):
        return {"message": "EventSign deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete account.",
        )

def create_notif_all(db: Session, admin_id: int, volunteer_id: int, message: str):
    event = schemas.Notification(admin_id=admin_id, volunteer_id=volunteer_id, Message=message)
    return services.create_notif(db, event)

##################gets notification and deletes it after it has been seen###############
@router.get("/notifications/{id}")
def get_notifications_by_id(id: int, db: Session = Depends(get_db)):
    notifications = db.query(models.Notifications).filter(models.Notifications.volunteer_id == id).all()
    return notifications

@router.delete("/remove-notifs/{id}")
def remove_notifs(id: int, db: Session = Depends(get_db)):
    if services.delete_notifs(db, id):
        return {"message": "success"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed.",
        )
#############################get and post events signed up##############################
@router.post("/events-signed-up/", response_model=schemas.EventsSignedUp)
def create_eventsign(event: schemas.EventsSignedUpBase, db: Session = Depends(get_db)):
    return services.create_eventsign(db, event)

@router.get("/events-signed-up/")
def get_all_eventsSigned(db: Session = Depends(get_db)):
    return db.query(models.EventsSignedUp).all()

@router.get("/events-signed-with-id/{volunteer_id}")
def get_events_signed_up(volunteer_id: int, db: Session = Depends(get_db)):
    events_signed_up = db.query(models.EventsSignedUp).filter(models.EventsSignedUp.volunteer_id == volunteer_id).all()
    events_data = []
    for event_signed_up in events_signed_up:
        event = db.query(models.Event).filter(models.Event.id == event_signed_up.event_id).first()
        if event:
            events_data.append(event)
    if not events_data:
        raise HTTPException(status_code=404, detail="No events found for the provided volunteer_id")

    return events_data
#############################Fetch events and volunteers who signed up using event id on admin frontend#######################
@router.get("/event-signups/{event_id}")
def get_event_signups(event_id: int, db: Session = Depends(get_db)):

    event_signups = services.get_event_signups_by_event_id(db, event_id)
    if not event_signups:
        raise HTTPException(status_code=404, detail="Event sign-ups not found")

    volunteer_ids = set(signup.volunteer_id for signup in event_signups)

    # Fetch user information for the volunteers
    volunteers = []
    for volunteer_id in volunteer_ids:
        user = services.get_user_by_id(db, volunteer_id)
        if user:
            volunteers.append(user)
    
    if not volunteers:
        raise HTTPException(status_code=404, detail="Volunteers not found")
    
    return {
    "event_signups": event_signups,
    "volunteers": volunteers
    }


# @router.delete("/delete-events-signed/{id}")
# def delete_account(id:int, db: Session = Depends(get_db)):
#     if services.delete_events_signed_up(db, id):
#         return {"message": "Account deleted successfully"}
#     else:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Failed to delete account.",
#         )
#####################################Post and get events volunteered###########################
@router.post("/events-volunteered/", response_model=schemas.EventsVolunteered)
def create_eventsign(event: schemas.EventsVolunteeredBase, db: Session = Depends(get_db)):
    return services.create_eventsign(db, event)

@router.get("/events-volunteered/{id}")
def get_all_jobs(id: int, db: Session = Depends(get_db)):
    return db.query(models.EventsVolunteered).filter(models.EventsVolunteered.volunteer_id == id).all()

####################Called by func to update profile score, event count###############
def update_lifetime_score(db: Session, volunteer_id: int, points: int, event_id: int):
    try:
        volunteer_profile = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == volunteer_id).first()
        event = db.query(models.Event).filter(models.Event.id == event_id).first()

        if volunteer_profile and event:
            total_points = points + event.rewards
            volunteer_profile.lifetimeScore += total_points
            volunteer_profile.eventCount += 1

            # Update leaderboard
            leaderboard_entry = db.query(models.Leaderboard).filter(models.Leaderboard.id == volunteer_id).first()
            if leaderboard_entry:
                leaderboard_entry.monthlyScore += total_points
            else:
                new_leaderboard_entry = models.Leaderboard(
                    id=volunteer_profile.id,
                    monthlyScore=volunteer_profile.lifetimeScore
                )
                db.add(new_leaderboard_entry)

            db.commit()
        else:
            raise HTTPException(status_code=404, detail="Volunteer or event not found")
    except Exception as e:
        db.rollback()  # Rollback changes if an error occurs
        logger.exception("Error updating lifetime score and leaderboard")
        raise HTTPException(status_code=500, detail="Error updating lifetime score and leaderboard")

##############Called by the func below to trigger move###############
def move_to_volunteered(db: Session, event_id: int, volunteer_id: int):
    try:
        event_signed_up = db.query(models.EventsSignedUp).filter(models.EventsSignedUp.event_id == event_id, models.EventsSignedUp.volunteer_id == volunteer_id).first()
        if event_signed_up:
            event_volunteered = models.EventsVolunteered(
                event_id=event_signed_up.event_id,
                event_date=event_signed_up.event_date,
                volunteer_id=event_signed_up.volunteer_id
            )
            db.add(event_volunteered)
            db.commit()
        else:
            raise HTTPException(status_code=404, detail="EventsSignedUp entry not found")
    except Exception as e:
        db.rollback()  # Rollback changes if an error occurs
        logger.exception("Error moving data from EventsSignedUp to EventsVolunteered")
        raise HTTPException(status_code=500, detail="Error moving data from EventsSignedUp to EventsVolunteered")

###########Update post event score only if score!=0 and then move the event from signed-up to volunteered########
@router.post("/update_lifetime_score_and_move/{event_id}")
async def update_lifetime_score_and_move_endpoint(event_id: int, volunteer_points: Dict[int, int], db: Session = Depends(get_db)):
    try:
        for volunteer_id, points in volunteer_points.items():
            if points > 0:
                update_lifetime_score(db, volunteer_id, points, event_id)
                move_to_volunteered(db, event_id, volunteer_id)

        services.delete_events_signed_up(db, event_id)

        return {"message": "Lifetime scores updated and data moved successfully"}
    except Exception as e:
        logger.exception("An error occurred while updating lifetime scores and moving data")
        raise HTTPException(status_code=500, detail="An error occurred while updating lifetime scores and moving data")




########################Fetch Leaderboard Standings with Associated Volunteer Info###########################
@router.get("/leaderboard/")
def get_leaderboard(db: Session = Depends(get_db)):
    try:
        # Fetch leaderboard entries and sort them by monthly score in descending order
        leaderboard_entries = db.query(models.Leaderboard).order_by(desc(models.Leaderboard.monthlyScore)).all()

        leaderboard_data = []

        # Iterate over sorted leaderboard entries
        for entry in leaderboard_entries:
            # Fetch volunteer profile associated with the leaderboard entry
            volunteer_profile = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == entry.id).first()

            # If volunteer profile exists, add it to the leaderboard data
            if volunteer_profile:
                leaderboard_data.append({
                    "id": entry.id,
                    "monthly_score": entry.monthlyScore,
                    "volunteerfirstName": f"{volunteer_profile.firstName} {volunteer_profile.lastName}",
                })

        return leaderboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error occurred while fetching leaderboard data")

##########################Fetches all mvv#######################
@router.get("/mvv/")
def get_mvv(db: Session = Depends(get_db)):
    mvv_with_names = []
    mvv_records = db.query(models.MVV).all()
    if mvv_records:
        for mvv_record in mvv_records:
            volunteer_profile = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == mvv_record.id).first()
            if volunteer_profile:
                mvv_with_name = {
                    "id": mvv_record.id,
                    "firstName": volunteer_profile.firstName,
                    "lastName": volunteer_profile.lastName,
                }
                mvv_with_names.append(mvv_with_name)
            else:
                # Handle case where volunteer profile is not found for an MVV record
                raise HTTPException(status_code=404, detail="Volunteer profile not found for MVV record")
        return mvv_with_names
    else:
        return None



# Include the router in the main application
app.include_router(router, prefix="/api")

####################Code to select MVV at the end of the month and increase medal count of winner###################
def is_last_day_of_month():
    target_date = datetime(2024, 4, 15).date()  # April 15, 2024, 1:10 AM
    current_date = datetime.now().date()
    print("Running...")
    print(target_date)
    return current_date == target_date

def process_leaderboard(db):
    if is_last_day_of_month():
        leaderboard = db.query(models.Leaderboard).all()
        top_score = max(leaderboard, key=lambda x: x.monthlyScore).monthlyScore
        top_ids = [model.id for model in leaderboard if model.monthlyScore == top_score]

        db.query(models.MVV).delete()
        db.commit()

        # Increment medals for top performer(s)
        for id in top_ids:
            volunteer = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == id).first()
            if volunteer:
                volunteer.medals += 1  # Increment medals by 1
                db.commit()

        # Add MVV(s)
        for id in top_ids:
            mvv = models.MVV(id=id)
            db.add(mvv)
        db.commit()

async def background_task():
    while True:
        db = next(get_db())
        process_leaderboard(db)
        await asyncio.sleep(7200)

def run_background_task():
    asyncio.run(background_task())

# Start the background thread
background_thread = threading.Thread(target=run_background_task)
background_thread.daemon = True  # Daemonize the thread so it stops when the main program exits
background_thread.start()

print("Background task started successfully!")