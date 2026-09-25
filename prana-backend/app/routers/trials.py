from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Trial, User, PatientContract
from app.schemas import TrialCreate
from app.core.security import require_role, get_current_user
from app.core.audit import log_audit_action

router = APIRouter(prefix="/trials", tags=["Clinical Trial Portfolio & KPIs"])

@router.get("/", response_model=List[dict])
def get_trials(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Trial)
    
    # Role-based scoping
    if current_user.role == "researcher":
        query = query.filter(Trial.researcher_id == current_user.id)
    elif current_user.role == "patient":
        # Query PatientContracts directly using the database session
        patient_contracts = db.query(PatientContract).filter(PatientContract.patient_id == current_user.id).all()
        contracted_trial_ids = [c.trial_id for c in patient_contracts]
        query = query.filter(Trial.id.in_(contracted_trial_ids))
    # Doctors & Govt officials see all trials
        
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

@router.patch("/{trial_id}/status", response_model=dict)
def update_trial_status(
    trial_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["gov_official", "admin"]))
):
    """Allows government regulators to Pause, Terminate, or Complete a trial."""
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    new_status = status_data.get("status")
    if new_status not in ["Active", "Paused", "Terminated", "Completed"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
        
    trial.status = new_status
    db.commit()
    
    log_audit_action(db, current_user.id, "UPDATE_TRIAL_STATUS", f"Changed trial {trial.ctri_number} status to {new_status}")
    return {"status": "success", "message": f"Trial status updated to {new_status}"}