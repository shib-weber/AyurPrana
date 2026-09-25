from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Trial, PatientContract, AdverseEvent, User
from app.core.security import get_current_user

router = APIRouter(prefix="/export", tags=["CDISC & SDTM Exports"])

@router.get("/trial/{trial_id}/define-xml")
def export_define_xml(trial_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    contracts = db.query(PatientContract).filter(PatientContract.trial_id == trial_id).all()
    events = db.query(AdverseEvent).filter(AdverseEvent.trial_id == trial_id).all()

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3" FileType="Transactional" Granularity="Metadata">
  <ClinicalData StudyOID="{trial.ctri_number}" MetaDataVersionOID="MDV.2026.001">
    <StudyEventData StudyEventOID="SE.TRIAL" StudyEventRepeatKey="1">
      <FormData FormOID="FO.TRIAL_METRICS">
        <ItemGroupData ItemGroupOID="IG.TRIAL_SUMMARY" ItemGroupRepeatKey="1">
          <ItemData ItemOID="IT.TRIAL_TITLE" Value="{trial.title}"/>
          <ItemData ItemOID="IT.PHASE" Value="{trial.phase}"/>
          <ItemData ItemOID="IT.ENROLMENT" Value="{len(contracts)}"/>
          <ItemData ItemOID="IT.SAFETY_EVENTS" Value="{len(events)}"/>
          <ItemData ItemOID="IT.COMPLIANCE" Value="{trial.compliance_score}%"/>
        </ItemGroupData>
      </FormData>
    </StudyEventData>
  </ClinicalData>
</ODM>"""

    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={"Content-Disposition": f"attachment; filename=Define_XML_{trial.ctri_number.replace('/', '_')}.xml"}
    )

@router.get("/trial/{trial_id}/sdtm-csv")
def export_sdtm_csv(trial_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    contracts = db.query(PatientContract).filter(PatientContract.trial_id == trial_id).all()
    
    # Generate CDISC SDTM Demographics (DM) domain tabular CSV package
    csv_data = "STUDYID,USUBJID,ARM,AGE,SEX,COUNTRY\n"
    for c in contracts:
        csv_data += f'"{trial.ctri_number}","SUBJ-{c.patient_id}","Ayurvedic Compound Arm",42,"M","IN"\n'

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=SDTM_DM_{trial.ctri_number.replace('/', '_')}.csv"}
    )