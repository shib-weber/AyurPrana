from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False) # 'doctor', 'patient', 'researcher', 'gov_official'
    full_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Trial(Base):
    __tablename__ = "trials"
    
    id = Column(Integer, primary_key=True, index=True)
    ctri_number = Column(String(50), unique=True, index=True)
    title = Column(String(255), nullable=False)
    phase = Column(String(20), nullable=False)
    status = Column(String(30), default="Recruiting")
    target_enrolment = Column(Integer, default=100)
    current_enrolment = Column(Integer, default=0)
    compliance_score = Column(Float, default=98.5)
    principal_investigator = Column(String(100))
    researcher_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class PatientContract(Base):
    __tablename__ = "patient_contracts"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_ref = Column(String(50), unique=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    trial_id = Column(Integer, ForeignKey("trials.id"))
    status = Column(String(30), default="Active")
    consent_signed_date = Column(DateTime, nullable=True)
    e_signature = Column(String(255), nullable=True)
    ayushman_bharat_id = Column(String(50), nullable=True)
    
    patient = relationship("User", foreign_keys=[patient_id])
    doctor = relationship("User", foreign_keys=[doctor_id])
    trial = relationship("Trial", foreign_keys=[trial_id])

class AdverseEvent(Base):
    __tablename__ = "adverse_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_code = Column(String(50), unique=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    trial_id = Column(Integer, ForeignKey("trials.id"))
    severity = Column(String(20), nullable=False)
    meddra_preferred_term = Column(String(100), nullable=False)
    who_drug_code = Column(String(50), nullable=True)
    reported_date = Column(DateTime, default=datetime.utcnow)
    outcome = Column(String(50), default="Recovering")
    regulatory_notified = Column(Boolean, default=True)
    doctor_solution = Column(Text, nullable=True) # Solution provided by doctor
    
    patient = relationship("User", foreign_keys=[patient_id])
    trial = relationship("Trial", foreign_keys=[trial_id])

class DailyHealthLog(Base):
    __tablename__ = "daily_health_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    trial_id = Column(Integer, ForeignKey("trials.id"))
    log_date = Column(DateTime, default=datetime.utcnow)
    vitals_summary = Column(String(255), nullable=False) # e.g. "BP: 120/80, Temp: 98.4F"
    symptoms_notes = Column(Text, nullable=True)
    
    patient = relationship("User", foreign_keys=[patient_id])

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(Integer, nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), default="127.0.0.1")