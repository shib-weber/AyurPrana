from sqlalchemy.orm import Session
from app.models import AuditLog

def log_audit_action(db: Session, user_id: int, action: str, details: str = None, ip_address: str = "127.0.0.1"):
    """
    ALCOA+ immutable audit trail recorder. Every data insertion, update, 
    or regulatory sign-off is stamped with user, timestamp, and details.
    """
    audit_entry = AuditLog(
        user_id=user_id,
        action=action,
        details=details,
        ip_address=ip_address
    )
    db.add(audit_entry)
    db.commit()