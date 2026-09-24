from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import AuditLog, User, Trial
from app.core.security import require_role

router = APIRouter(prefix="/audit", tags=["Immutable JSON Audit Stream"])

@router.get("/logs", response_model=list)
def get_audit_logs(
    trial_id: Optional[int] = Query(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_role(["doctor", "researcher", "gov_official", "admin"]))
):
    query = db.query(AuditLog)
    
    # If trial_id is specified, filter logs matching that trial
    if trial_id:
        # If user is a researcher, verify they own the trial first to maintain isolation
        if current_user.role == "researcher":
            trial = db.query(Trial).filter(Trial.id == trial_id, Trial.researcher_id == current_user.id).first()
            if not trial:
                raise HTTPException(status_code=403, detail="Access denied to this trial's audit logs")
        
        query = query.filter(
            (AuditLog.details.like(f"%trial {trial_id}%")) | 
            (AuditLog.details.like(f"%Trial {trial_id}%")) |
            (AuditLog.details.like(f"%trial_id: {trial_id}%"))
        )
        
    logs = query.order_by(AuditLog.timestamp.desc()).all()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "user_id": l.user_id,
            "action": l.action,
            "details": l.details,
            "ip_address": l.ip_address
        }
        for l in logs
    ]