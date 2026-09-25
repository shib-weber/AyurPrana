from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.database import get_db
from app.models import PatientContract, User, Trial
from app.schemas import ContractCreate
from app.core.security import require_role, get_current_user
from app.core.audit import log_audit_action

router = APIRouter(prefix="/contracts", tags=["Doctor-Patient Official Contracts"])

@router.get("/", response_model=list)
def get_contracts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetches contracts based on logged in user role (Patient sees own, Doctor sees own, others see all)."""
    query = db.query(PatientContract)
    if current_user.role == "patient":
        query = query.filter(PatientContract.patient_id == current_user.id)
    elif current_user.role == "doctor":
        query = query.filter(PatientContract.doctor_id == current_user.id)
    
    contracts = query.all()
    return [
        {
            "id": c.id,
            "contract_ref": c.contract_ref,
            "patient_name": c.patient.full_name if c.patient else "Unknown",
            "patient_id": c.patient_id,
            "doctor_id": c.doctor_id,
            "trial_id": c.trial_id,
            "status": c.status,
            "consent_signed_date": c.consent_signed_date,
            "e_signature": c.e_signature,
            "ayushman_bharat_id": c.ayushman_bharat_id
        }
        for c in contracts
    ]

@router.post("/", response_model=dict)
def create_patient_contract(
    contract: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["doctor", "admin"]))
):
    patient = db.query(User).filter(User.id == contract.patient_id, User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Valid patient not found")
    
    trial = db.query(Trial).filter(Trial.id == contract.trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    if trial.status in ["Paused", "Terminated"]:
        raise HTTPException(status_code=400, detail=f"Cannot enroll patients. Trial is currently {trial.status}.")
    
    unique_suffix = uuid.uuid4().hex[:6].upper()
    contract_ref = f"PRANA-CNT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{contract.patient_id}-{contract.trial_id}-{unique_suffix}"
    
    new_contract = PatientContract(
        contract_ref=contract_ref,
        patient_id=contract.patient_id,
        doctor_id=current_user.id,
        trial_id=contract.trial_id,
        status="Active",
        consent_signed_date=datetime.utcnow(),
        e_signature=contract.e_signature,
        ayushman_bharat_id=contract.ayushman_bharat_id
    )
    
    db.add(new_contract)
    trial.current_enrolment += 1
    db.commit()
    
    log_audit_action(db, current_user.id, "PATIENT_CONTRACT_FORMED", f"Contract {contract_ref} established.")
    return {"status": "success", "contract_ref": contract_ref}