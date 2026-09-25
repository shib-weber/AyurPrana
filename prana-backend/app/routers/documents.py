from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ResearchDocument, Trial, User
from app.core.security import get_current_user, require_role
from datetime import datetime

router = APIRouter(prefix="/documents", tags=["Research Document Verification"])

@router.get("/", response_model=list)
def get_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "researcher":
        docs = db.query(ResearchDocument).filter(ResearchDocument.researcher_id == current_user.id).all()
    else:
        docs = db.query(ResearchDocument).all()
    
    return [
        {
            "id": d.id,
            "researcher_id": d.researcher_id,
            "title": d.title,
            "category": d.category,
            "filename": d.filename,
            "file_data": d.file_data, # <-- Includes Base64 payload for live viewing
            "status": d.status,
            "assigned_crda": d.assigned_crda,
            "submitted_date": d.submitted_date.isoformat() if d.submitted_date else None
        }
        for d in docs
    ]

@router.post("/", response_model=dict)
def submit_document(doc_data: dict, db: Session = Depends(get_db), current_user: User = Depends(require_role(["researcher"]))):
    new_doc = ResearchDocument(
        researcher_id=current_user.id,
        title=doc_data.get("title"),
        category=doc_data.get("category"),
        filename=doc_data.get("filename", "protocol.pdf"),
        file_data=doc_data.get("file_data"), # <-- Saves Base64 file string
        status="Pending"
    )
    db.add(new_doc)
    db.commit()
    return {"status": "success", "message": "Research document submitted for Ethics Committee verification."}

@router.patch("/{doc_id}/review", response_model=dict)
def review_document(doc_id: int, review_data: dict, db: Session = Depends(get_db), current_user: User = Depends(require_role(["doctor", "gov_official", "admin", "gov_investigator"]))):
    doc = db.query(ResearchDocument).filter(ResearchDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    action = review_data.get("status") # Accepted or Rejected
    if action not in ["Accepted", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid review status")
    
    doc.status = action
    if action == "Accepted":
        crda_num = f"CRDA/AIIA/2026/{1000 + doc.id}"
        doc.assigned_crda = crda_num
        
        new_trial = Trial(
            ctri_number=crda_num,
            title=doc.title,
            phase="Phase III",
            status="Recruiting",
            target_enrolment=150,
            principal_investigator=current_user.full_name,
            researcher_id=doc.researcher_id
        )
        db.add(new_trial)
    
    db.commit()
    return {"status": "success", "message": f"Document {action} successfully."}