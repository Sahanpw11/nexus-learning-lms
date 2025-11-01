from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, UserRole
from schemas import User as UserSchema, UserCreate, UserUpdate
from auth import get_current_active_user, require_roles, get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[UserSchema])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserSchema)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Users can only view their own profile unless they're admin
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Users can only update their own profile unless they're admin
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return user

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Soft delete by setting is_active to False
    user.is_active = False
    db.commit()
    
    return {"message": "User deactivated successfully"}

@router.get("/teachers/all", response_model=List[UserSchema])
def get_all_teachers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    teachers = db.query(User).filter(User.role == UserRole.TEACHER, User.is_active == True).all()
    return teachers

@router.get("/students/all", response_model=List[UserSchema])
def get_all_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "teacher"]))
):
    students = db.query(User).filter(User.role == UserRole.STUDENT, User.is_active == True).all()
    return students
