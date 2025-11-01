from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from config import CORS_ORIGINS
from database import engine, Base
from routers import auth, users, classes
from models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexus Learning API by Reactor Minds",
    description="Modern Learning Management Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(classes.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Nexus Learning API by Reactor Minds",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Nexus Learning by Reactor Minds"}

# Global exception handler
@app.exception_handler(IntegrityError)
async def integrity_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": "Database integrity error. Check for duplicate entries or missing references."}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
