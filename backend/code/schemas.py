from typing import List, Optional
from datetime import date
from pydantic import BaseModel


class VolunteerProfileBase(BaseModel):
    email: str
    password_hash: str


class VolunteerProfile(VolunteerProfileBase):
    id: int
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    dob: Optional[date] = None
    city: Optional[str] = None
    blood: Optional[str] = None
    gender: Optional[str] = None
    biography: Optional[str] = None
    lifetimeScore: Optional[int] = 0
    totalMedals: Optional[int] = 0
    eventCount: Optional[int] = 0
    interests: Optional[str] = None
    skills: Optional[str] = None
    profileImage: Optional[bytes] = None
    AccountCreationDate: date
    
    class Config:
        from_attributes = True

class VolunteerProfileUpdate(VolunteerProfileBase):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    dob: Optional[date] = None
    city: Optional[str] = None
    blood: Optional[str] = None
    gender: Optional[str] = None
    biography: Optional[str] = None
    lifetimeScore: Optional[int] = 0
    totalMedals: Optional[int] = 0
    eventCount: Optional[int] = 0
    interests: Optional[str] = None
    skills: Optional[str] = None
    profileImage: Optional[bytes] = None

class AdminProfileBase(BaseModel):
    id: int
    password: str

class AdminProfileCreate(AdminProfileBase):
    Designation: str

class AdminProfile(AdminProfileBase):
    email:Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    dob: Optional[date] = None
    city: Optional[str] = None
    blood: Optional[str] = None
    gender: Optional[str] = None
    biography: Optional[str] = None
    profileImage: Optional[bytes] = None
    AccountCreationDate: date
    Designation: str

    class Config:
        from_attributes = True

class AdminProfileUpdate(BaseModel):
    email:Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    dob: Optional[date] = None
    city: Optional[str] = None
    blood: Optional[str] = None
    gender: Optional[str] = None
    biography: Optional[str] = None
    profileImage: Optional[bytes] = None

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    rewards: Optional[int] = 0
    time: str
    date: date
    location: str
    admin_id: int

    class Config:
        arbitrary_types_allowed = True

class Event(EventBase):
    id: int

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    positionTitle: str
    deadline: date
    admin_id: int

    class Config:
        arbitrary_types_allowed = True

class JobBaseUpdate(JobBase):
    description: Optional[str] = None
    banner_image: Optional[bytes] = None

class Job(JobBase):
    id: int

    class Config:
        from_attributes = True

class ArticleBase(BaseModel):
    title: str
    article: bytes
    date: date
    admin_id: int

    class Config:
        arbitrary_types_allowed = True

class ArticleBaseUpdate(ArticleBase):
    banner_image: Optional[bytes] = None

class Article(ArticleBase):
    id: int

    class Config:
        from_attributes = True


class RequestBase(BaseModel):
    admin_id: int
    event_id: int
    volunteer_id: int
    volunteer_email: str

class Request(RequestBase):
    request_id: int

    class Config:
        from_attributes = True


class InvitationBase(BaseModel):
    admin_id: int
    event_id: int
    volunteer_id: int

class Invitation(InvitationBase):
    invite_id: int

    class Config:
        from_attributes = True


class EventsSignedUpBase(BaseModel):
    volunteer_id: int
    event_id: int
    event_date: date
    admin_id: int

class EventsSignedUp(EventsSignedUpBase):
    event_signed_id: int

    class Config:
        from_attributes = True


class EventsVolunteeredBase(BaseModel):
    volunteer_id: int
    event_id: int
    event_date: date

class EventsVolunteered(EventsVolunteeredBase):
    event_volunteer_id: int

    class Config:
        from_attributes = True

class MVVBase(BaseModel):
   id: int

class MVV(MVVBase):
    id: int

    class Config:
        from_attributes = True

class Notification(BaseModel):
    admin_id: int
    volunteer_id: int
    Message: str
class NotificationBase(Notification):
    id: int

    class Config:
        from_attributes = True

class ChangePass(BaseModel):
    userid: int
    oldpass: str
    newpass: str