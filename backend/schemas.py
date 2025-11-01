from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from models import UserRole

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Class Schemas
class ClassBase(BaseModel):
    name: str
    description: Optional[str] = None
    subject: str

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    is_active: Optional[bool] = None

class Class(ClassBase):
    id: int
    teacher_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Material Schemas
class MaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_type: str

class MaterialCreate(MaterialBase):
    pass

class Material(MaterialBase):
    id: int
    file_url: str
    file_size: Optional[int] = None
    class_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Assignment Schemas
class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: datetime
    max_points: int = 100

class AssignmentCreate(AssignmentBase):
    class_id: int

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_points: Optional[int] = None

class Assignment(AssignmentBase):
    id: int
    class_id: int
    teacher_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Submission Schemas
class SubmissionBase(BaseModel):
    text_content: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    assignment_id: int

class SubmissionUpdate(BaseModel):
    text_content: Optional[str] = None
    grade: Optional[int] = None
    feedback: Optional[str] = None

class Submission(SubmissionBase):
    id: int
    assignment_id: int
    student_id: int
    file_url: Optional[str] = None
    submitted_at: datetime
    grade: Optional[int] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True

# Live Session Schemas
class LiveSessionBase(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_start: datetime
    scheduled_end: datetime

class LiveSessionCreate(LiveSessionBase):
    class_id: int

class LiveSessionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    meeting_url: Optional[str] = None
    meeting_id: Optional[str] = None
    is_recorded: Optional[bool] = None
    recording_url: Optional[str] = None

class LiveSession(LiveSessionBase):
    id: int
    class_id: int
    meeting_url: Optional[str] = None
    meeting_id: Optional[str] = None
    is_recorded: bool
    recording_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Note Schemas
class NoteBase(BaseModel):
    title: str
    content: str
    class_id: Optional[int] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    class_id: Optional[int] = None

class Note(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Calendar Event Schemas
class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    event_type: str
    reference_id: Optional[int] = None

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    event_type: Optional[str] = None
    reference_id: Optional[int] = None

class CalendarEvent(CalendarEventBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Enrollment Schemas
class EnrollmentCreate(BaseModel):
    student_id: int
    class_id: int

class Enrollment(BaseModel):
    id: int
    student_id: int
    class_id: int
    enrolled_at: datetime

    class Config:
        from_attributes = True
