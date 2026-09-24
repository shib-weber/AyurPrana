from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DailyHealthLog, AdverseEvent, User
from app.schemas import DailyLogCreate, DoctorSolutionUpdate
from app.core.security import get_current_user, require_role
from app.core.audit import log_audit_action

router = APIRouter(prefix="/health", tags=["Patient Health Logs & Doctor Solutions"])

@router.post("/log")
def create_daily_log(log: DailyLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_log = DailyHealthLog(
        patient_id=current_user.id if current_user.role == 'patient' else log.patient_id,
        trial_id=log.trial_id,
        vitals_summary=log.vitals_summary,
        symptoms_notes=log.symptoms_notes
    )
    db.add(db_log)
    db.commit()
    log_audit_action(db, current_user.id, "DAILY_HEALTH_LOG", f"Daily health vitals logged for patient.")
    return {"status": "success", "message": "Health log recorded"}

@router.get("/logs/{patient_id}")
def get_patient_logs(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(DailyHealthLog).filter(DailyHealthLog.patient_id == patient_id).all()
    return logs

@router.post("/solution/{event_id}")
def provide_doctor_solution(event_id: int, payload: DoctorSolutionUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["doctor"]))):
    event = db.query(AdverseEvent).filter(AdverseEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Adverse event not found")
    event.doctor_solution = payload.solution
    db.commit()
    log_audit_action(db, current_user.id, "DOCTOR_SOLUTION", f"Doctor provided solution for event {event.event_code}")
    return {"status": "success", "message": "Solution dispatched to patient"}

@router.get("/logs/patient/{patient_id}")
def get_patient_health_logs(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(DailyHealthLog).filter(DailyHealthLog.patient_id == patient_id).all()
    return [
        {
            "id": l.id,
            "log_date": l.log_date,
            "vitals_summary": l.vitals_summary,
            "symptoms_notes": l.symptoms_notes,
            "trial_id": l.trial_id
        }
        for l in logs
    ]