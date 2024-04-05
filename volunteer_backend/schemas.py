

from datetime import datetime
from pydantic import BaseModel
from typing import List


class UserBase(BaseModel):
    username :str
    email: str

class UserCreate(UserBase):
    password: str

    class Config:
        from_attributes = True

class UserUpdate(UserBase):
    name: str
    gender: str
    phone: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class EventSchema(BaseModel):
    title: str
    description: str
    location: str
    date: datetime # It will be only date later
    time: datetime # It will be only time later
    organizer_company: str

#-------------------------------------------------------------------------------------------------------------------------------------
class UserEventBase(BaseModel):
    event_id: int
    event_name: str
    event_status: str

class UserEvent(UserEventBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserEventList(BaseModel):
    user_events: List[UserEvent]