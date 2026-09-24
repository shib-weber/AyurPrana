from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Trial, User
from app.schemas import TrialCreate
from app.core.security import require_role, get_current_user
from app.core.audit import log_audit_action

router = APIRouter(prefix="/trials", tags=["Clinical Trial Portfolio & KPIs"])

@router.get("/", response_model=List[dict])
def get_trials(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Trial)
    
    # Strict isolation: Researchers see only their own registered trials
    if current_user.role == "researcher":
        query = query.filter(Trial.researcher_id == current_user.id)
        
    trials = query.all()
    return [
        {
            "id": t.id,
            "ctri_number": t.ctri_number,
            "title": t.title,
            "phase": t.phase,
            "status": t.status,
            "recruitment_progress": f"{(t.current_enrolment / t.target_enrolment) * 100:.1f}%" if t.target_enrolment > 0 else "0.0%",
            "current_enrolment": t.current_enrolment,
            "target_enrolment": t.target_enrolment,
            "compliance_score": t.compliance_score,
            "principal_investigator": t.principal_investigator,
            "researcher_id": t.researcher_id
        }
        for t in trials
    ]

@router.post("/", response_model=dict)
def create_trial(
    trial: TrialCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_role(["researcher", "admin"]))
):
    trial_data = trial.dict()
    trial_data["researcher_id"] = current_user.id  # Automatically tag trial with logged-in researcher ID
    
    new_trial = Trial(**trial_data)
    db.add(new_trial)
    db.commit()
    db.refresh(new_trial)
    
    log_audit_action(db, current_user.id, "TRIAL_CREATED", f"Created trial CTRI: {new_trial.ctri_number}")
    return {"message": "Trial registered successfully", "trial_id": new_trial.id, "ctri_number": new_trial.ctri_number}