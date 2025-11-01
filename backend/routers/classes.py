from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Class, User, UserRole, Enrollment
from schemas import Class as ClassSchema, ClassCreate, ClassUpdate, EnrollmentCreate, Enrollment as EnrollmentSchema
from auth import get_current_active_user, require_roles

router = APIRouter(prefix="/classes", tags=["classes"])

@router.post("/", response_model=ClassSchema)
def create_class(
    class_data: ClassCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "teacher"]))
):
    # Only teachers can create classes for themselves, admins can create for any teacher
    teacher_id = current_user.id
    if current_user.role == UserRole.ADMIN:
        # Admin can specify teacher_id in the future, for now use current user
        teacher_id = current_user.id
    
    db_class = Class(
        name=class_data.name,
        description=class_data.description,
        subject=class_data.subject,
        teacher_id=teacher_id
    )
    
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    
    return db_class

@router.get("/", response_model=List[ClassSchema])
def get_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role == UserRole.ADMIN:
        # Admin sees all classes
        classes = db.query(Class).filter(Class.is_active == True).all()
    elif current_user.role == UserRole.TEACHER:
        # Teacher sees their own classes
        classes = db.query(Class).filter(
            Class.teacher_id == current_user.id,
            Class.is_active == True
        ).all()
    else:
        # Student sees enrolled classes
        enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
        class_ids = [enrollment.class_id for enrollment in enrollments]
        classes = db.query(Class).filter(
            Class.id.in_(class_ids),
            Class.is_active == True
        ).all()
    
    return classes

@router.get("/{class_id}", response_model=ClassSchema)
def get_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.STUDENT:
        # Check if student is enrolled
        enrollment = db.query(Enrollment).filter(
            Enrollment.student_id == current_user.id,
            Enrollment.class_id == class_id
        ).first()
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enrolled in this class"
            )
    elif current_user.role == UserRole.TEACHER and class_obj.teacher_id != current_user.id:
        # Teacher can only see their own classes
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this class"
        )
    
    return class_obj

@router.put("/{class_id}", response_model=ClassSchema)
def update_class(
    class_id: int,
    class_update: ClassUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Only teacher of the class or admin can update
    if current_user.role != UserRole.ADMIN and class_obj.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this class"
        )
    
    # Update class fields
    update_data = class_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(class_obj, field, value)
    
    db.commit()
    db.refresh(class_obj)
    
    return class_obj

@router.delete("/{class_id}")
def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "teacher"]))
):
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Only teacher of the class or admin can delete
    if current_user.role != UserRole.ADMIN and class_obj.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this class"
        )
    
    # Soft delete
    class_obj.is_active = False
    db.commit()
    
    return {"message": "Class deleted successfully"}

@router.post("/{class_id}/enroll", response_model=EnrollmentSchema)
def enroll_student(
    class_id: int,
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "teacher"]))
):
    # Check if class exists
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Check if student exists
    student = db.query(User).filter(
        User.id == enrollment_data.student_id,
        User.role == UserRole.STUDENT
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check if already enrolled
    existing_enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == enrollment_data.student_id,
        Enrollment.class_id == class_id
    ).first()
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already enrolled in this class"
        )
    
    # Create enrollment
    db_enrollment = Enrollment(
        student_id=enrollment_data.student_id,
        class_id=class_id
    )
    
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    
    return db_enrollment

@router.get("/{class_id}/students", response_model=List[dict])
def get_class_students(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "teacher"]))
):
    # Check if class exists and user has permission
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    if current_user.role == UserRole.TEACHER and class_obj.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this class's students"
        )
    
    # Get enrolled students
    enrollments = db.query(Enrollment).filter(Enrollment.class_id == class_id).all()
    students = []
    
    for enrollment in enrollments:
        student = db.query(User).filter(User.id == enrollment.student_id).first()
        if student:
            students.append({
                "id": student.id,
                "email": student.email,
                "full_name": student.full_name,
                "enrolled_at": enrollment.enrolled_at
            })
    
    return students
