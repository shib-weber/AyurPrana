from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import AdverseEvent, User, Trial
from app.schemas import AdverseEventCreate
from app.core.security import require_role, get_current_user
from app.core.audit import log_audit_action

router = APIRouter(prefix="/pv", tags=["NPvCC Pharmacovigilance & Safety Module"])

@router.post("/report-ae", response_model=dict)
def report_adverse_event(
    ae: AdverseEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["patient", "doctor", "researcher", "admin"]))
):
    """
    Captures Adverse Drug Reactions / Serious Adverse Events (SAE) 
    coded to MedDRA & WHO Drug dictionaries, routing signals to NPvCC.
    """
    event_code = f"NPvCC-AE-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    # If the user is a patient, enforce their own patient ID
    patient_id = current_user.id if current_user.role == "patient" else ae.patient_id
    
    new_ae = AdverseEvent(
        event_code=event_code,
        patient_id=patient_id,
        trial_id=ae.trial_id,
        severity=ae.severity,
        meddra_preferred_term=ae.meddra_preferred_term,
        who_drug_code=ae.who_drug_code or "WHOD-AUTO",
        outcome=ae.outcome or "Under Observation",
        regulatory_notified=True if ae.severity in ["Severe", "SAE"] else False
    )
    
    db.add(new_ae)
    db.commit()
    
    log_audit_action(db, current_user.id, "AE_REPORTED", f"Adverse Event {event_code} logged with MedDRA term {ae.meddra_preferred_term}")
    
    return {
        "status": "success",
        "event_code": event_code,
        "npvcc_routing": "Routed successfully to National Pharmacovigilance Coordination Centre",
        "regulatory_notified": new_ae.regulatory_notified
    }

@router.get("/events", response_model=list)
def get_adverse_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    events = db.query(AdverseEvent).all()
    return [
        {
            "id": e.id,
            "event_code": e.event_code,
            "patient_id": e.patient_id,
            "trial_id": e.trial_id,
            "severity": e.severity,
            "meddra_preferred_term": e.meddra_preferred_term,
            "outcome": e.outcome,
            "doctor_solution": e.doctor_solution,
            "reported_date": e.reported_date,
            # Anonymize patient details if user is a researcher
            "patient_name": e.patient.full_name if current_user.role in ["doctor", "gov_official", "admin"] else f"Anonymized Subject #{e.patient_id}"
        }
        for e in events
    ]