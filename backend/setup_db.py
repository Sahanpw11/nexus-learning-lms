"""
Initial database setup script
Creates an admin user and sample data
"""
import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, UserRole
from auth import get_password_hash

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")

def create_admin_user():
    """Create the first admin user"""
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if admin:
            print("✅ Admin user already exists")
            return

        # Create admin user
        admin_user = User(
            email="admin@reactorminds.com",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully")
        print(f"   Email: {admin_user.email}")
        print(f"   Password: admin123")
        print(f"   Role: {admin_user.role.value}")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def create_sample_users():
    """Create sample teacher and student users"""
    db = SessionLocal()
    try:
        # Create sample teacher
        teacher = db.query(User).filter(User.email == "teacher@example.com").first()
        if not teacher:
            teacher = User(
                email="teacher@example.com",
                full_name="John Teacher",
                hashed_password=get_password_hash("teacher123"),
                role=UserRole.TEACHER,
                is_active=True
            )
            db.add(teacher)

        # Create sample student
        student = db.query(User).filter(User.email == "student@example.com").first()
        if not student:
            student = User(
                email="student@example.com",
                full_name="Jane Student",
                hashed_password=get_password_hash("student123"),
                role=UserRole.STUDENT,
                is_active=True
            )
            db.add(student)

        db.commit()
        print("✅ Sample users created successfully")
        print("   Teacher: teacher@example.com / teacher123")
        print("   Student: student@example.com / student123")
        
    except Exception as e:
        print(f"❌ Error creating sample users: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main setup function"""
    print("🚀 Starting Nexus Learning Database Setup...")
    print("=" * 50)
    
    # Create tables
    create_tables()
    
    # Create admin user
    create_admin_user()
    
    # Create sample users
    create_sample_users()
    
    print("=" * 50)
    print("🎉 Database setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Start the backend server: uvicorn main:app --reload")
    print("2. Start the frontend server: npm start")
    print("3. Login with the credentials above")

if __name__ == "__main__":
    main()
