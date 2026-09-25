from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.core.audit import log_audit_action

router = APIRouter(prefix="/auth", tags=["Authentication & Portal Access"])

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd,
        role=user.role,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    log_audit_action(db, db_user.id, "USER_REGISTERED", f"Created user {db_user.username} with role {db_user.role}")
    return db_user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    log_audit_action(db, user.id, "USER_LOGIN", f"User {user.username} logged in successfully.")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/patients", response_model=list)
def get_all_patients(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patients = db.query(User).filter(User.role == "patient").all()
    return [{"id": p.id, "full_name": p.full_name, "username": p.username, "email": p.email} for p in patients]

@router.get("/patient/{patient_id}")
def get_patient_by_id(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(User).filter(User.id == patient_id, User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "id": patient.id,
        "full_name": patient.full_name,
        "email": patient.email,
        "username": patient.username
    }

@router.get("/doctor/{doctor_id}")
def get_doctor_by_id(doctor_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doctor = db.query(User).filter(User.id == doctor_id, User.role == "doctor").first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {
        "id": doctor.id,
        "full_name": doctor.full_name,
        "email": doctor.email,
        "username": doctor.username
    }