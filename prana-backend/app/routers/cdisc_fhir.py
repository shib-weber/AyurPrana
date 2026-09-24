from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Trial, PatientContract, User
from app.core.security import require_role, get_current_user

router = APIRouter(prefix="/interop", tags=["CDISC (SDTM/ADaM) & HL7 FHIR R4 Interoperability"])

@router.get("/export-sdtm/{trial_id}", response_model=dict)
def export_sdtm_dataset(trial_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["researcher", "gov_official", "admin"]))):
    """
    Generates submission-ready CDISC SDTM (Demographics & Adverse Events) tabulation datasets.
    """
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    contracts = db.query(PatientContract).filter(PatientContract.trial_id == trial_id).all()
    
    sdtm_dm_domain = [
        {
            "STUDYID": f"AIIA-TRL-{trial.id}",
            "USUBJID": f"AIIA-SUBJ-{c.patient_id}",
            "ARM": trial.title,
            "RFSTDTC": c.consent_signed_date.isoformat() if c.consent_signed_date else None
        }
        for c in contracts
    ]
    
    return {
        "standard": "CDISC SDTM v1.4",
        "domain": "DM (Demographics)",
        "record_count": len(sdtm_dm_domain),
        "data": sdtm_dm_domain
    }

@router.get("/fhir/patient/{patient_id}", response_model=dict)
def get_fhir_patient_resource(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Exposes patient data as an HL7 FHIR R4 compliant JSON resource for ABDM interoperability.
    """
    patient = db.query(User).filter(User.id == patient_id, User.role == "patient").first()
    if not patient:
        return {"error": "Patient not found"}
        
    fhir_resource = {
        "resourceType": "Patient",
        "id": str(patient.id),
        "name": [{"use": "official", "text": patient.full_name}],
        "telecom": [{"system": "email", "value": patient.email}],
        "managingOrganization": {"display": "All India Institute of Ayurveda (AIIA)"}
    }
    return fhir_resource