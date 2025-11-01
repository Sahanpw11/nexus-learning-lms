from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    taught_classes = relationship("Class", foreign_keys="Class.teacher_id", back_populates="teacher")
    enrolled_classes = relationship("Enrollment", back_populates="student")
    assignments_created = relationship("Assignment", back_populates="teacher")
    submissions = relationship("Submission", back_populates="student")
    notes = relationship("Note", back_populates="user")
    calendar_events = relationship("CalendarEvent", back_populates="user")

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="taught_classes")
    enrollments = relationship("Enrollment", back_populates="class_")
    materials = relationship("Material", back_populates="class_")
    assignments = relationship("Assignment", back_populates="class_")
    live_sessions = relationship("LiveSession", back_populates="class_")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", back_populates="enrolled_classes")
    class_ = relationship("Class", back_populates="enrollments")

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    file_url = Column(String, nullable=False)  # Firebase Storage URL
    file_type = Column(String, nullable=False)  # pdf, video, image, etc.
    file_size = Column(Integer)  # Size in bytes
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    class_ = relationship("Class", back_populates="materials")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=False)
    max_points = Column(Integer, default=100)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    class_ = relationship("Class", back_populates="assignments")
    teacher = relationship("User", back_populates="assignments_created")
    submissions = relationship("Submission", back_populates="assignment")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_url = Column(String)  # Firebase Storage URL
    text_content = Column(Text)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    grade = Column(Integer)  # Points earned
    feedback = Column(Text)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")

class LiveSession(Base):
    __tablename__ = "live_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    scheduled_start = Column(DateTime(timezone=True), nullable=False)
    scheduled_end = Column(DateTime(timezone=True), nullable=False)
    meeting_url = Column(String)  # Video call URL
    meeting_id = Column(String)   # Meeting ID for video service
    is_recorded = Column(Boolean, default=False)
    recording_url = Column(String)  # Firebase Storage URL for recording
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    class_ = relationship("Class", back_populates="live_sessions")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)  # Optional association with class
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="notes")

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    event_type = Column(String, nullable=False)  # assignment, live_session, personal, etc.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reference_id = Column(Integer)  # ID of related assignment, session, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="calendar_events")
