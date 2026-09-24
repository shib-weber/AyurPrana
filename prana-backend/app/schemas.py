from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    full_name: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TrialCreate(BaseModel):
    ctri_number: str
    title: str
    phase: str
    status: str
    target_enrolment: int
    principal_investigator: str

class ContractCreate(BaseModel):
    patient_id: int
    trial_id: int
    e_signature: Optional[str] = None
    ayushman_bharat_id: Optional[str] = None

class AdverseEventCreate(BaseModel):
    patient_id: int
    trial_id: int
    severity: str
    meddra_preferred_term: str
    who_drug_code: Optional[str] = None
    outcome: str

class DailyLogCreate(BaseModel):
    patient_id: int
    trial_id: int
    vitals_summary: str
    symptoms_notes: Optional[str] = None

class DoctorSolutionUpdate(BaseModel):
    solution: str