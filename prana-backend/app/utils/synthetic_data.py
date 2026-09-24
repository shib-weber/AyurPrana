from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.models import User, Trial, PatientContract, AdverseEvent, DailyHealthLog, AuditLog

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_synthetic_data(db: Session):
    # Check if database is already seeded
    if db.query(User).first():
        return

    print("[Prana Seeder] Seeding comprehensive AIIA Ayurveda clinical trial dataset...")

    # 1. Seed Government Officials / Regulators (NPvCC)
    gov_users = [
        User(username="dr_verma_gov", email="verma.npvcc@ayush.gov.in", hashed_password=pwd_context.hash("password123"), role="gov_official", full_name="Dr. Alok Verma (NPvCC Director)"),
        User(username="sharma_moca", email="sharma.ayush@gov.in", hashed_password=pwd_context.hash("password123"), role="gov_official", full_name="Shreya Sharma (Ministry of Ayush)")
    ]

    # 2. Seed Researchers (5 Investigators)
    researchers = [
        User(username="dr_sen_research", email="a.sen@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Ananya Sen"),
        User(username="dr_das_research", email="r.das@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Randeep Das"),
        User(username="dr_roy_research", email="m.roy@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Moumita Roy"),
        User(username="dr_bose_research", email="s.bose@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Subrata Bose"),
        User(username="dr_nair_research", email="p.nair@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Priya Nair")
    ]

    # 3. Seed Doctors (5 Physicians)
    doctors = [
        User(username="dr_mukherjee", email="s.mukherjee@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Soumitra Mukherjee"),
        User(username="dr_banerjee", email="n.banerjee@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Nabanita Banerjee"),
        User(username="dr_chatterjee", email="k.chatterjee@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Kaushik Chatterjee"),
        User(username="dr_ganguly", email="t.ganguly@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Tanusree Ganguly"),
        User(username="dr_ghosh", email="a.ghosh@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Arindam Ghosh")
    ]

    # 4. Seed Patients (10 Participants)
    patients = [
        User(username="patient_rahul", email="rahul.patel@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Rahul Patel"),
        User(username="patient_priya", email="priya.sharma@yahoo.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Priya Sharma"),
        User(username="patient_amit", email="amit.verma@outlook.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Amit Verma"),
        User(username="patient_sneha", email="sneha.roy@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Sneha Roy"),
        User(username="patient_vikram", email="vikram.singh@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Vikram Singh"),
        User(username="patient_anita", email="anita.das@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Anita Das"),
        User(username="patient_rohit", email="rohit.mehra@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Rohit Mehra"),
        User(username="patient_puja", email="puja.nandy@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Puja Nandy"),
        User(username="patient_subham", email="subham.dey@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Subham Dey"),
        User(username="patient_megha", email="megha.gupta@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Megha Gupta")
    ]

    db.add_all(gov_users + researchers + doctors + patients)
    db.commit()

    # Re-query to get assigned IDs
    res_list = db.query(User).filter(User.role == "researcher").all()
    doc_list = db.query(User).filter(User.role == "doctor").all()
    pat_list = db.query(User).filter(User.role == "patient").all()

    # 5. Seed Clinical Trials (6 Studies mapped to researchers)
    trials = [
        Trial(
            ctri_number="CRDA/AIIA/2026/0142",
            title="Ashwagandha (Withania somnifera) Extract Standardization & Cognitive Efficacy Protocol",
            phase="Phase III",
            status="Recruiting",
            target_enrolment=150,
            current_enrolment=6,
            compliance_score=99.2,
            principal_investigator=res_list[0].full_name,
            researcher_id=res_list[0].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/0289",
            title="Panchakarma Basti Pharmacokinetics & Chronic Arthritis Relief Assessment",
            phase="Phase II",
            status="Active",
            target_enrolment=120,
            current_enrolment=4,
            compliance_score=98.5,
            principal_investigator=res_list[1].full_name,
            researcher_id=res_list[1].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/0411",
            title="Brahmi (Bacopa monnieri) Memory Retention & Neuroplasticity Clinical Evaluation",
            phase="Phase III",
            status="Recruiting",
            target_enrolment=200,
            current_enrolment=3,
            compliance_score=100.0,
            principal_investigator=res_list[2].full_name,
            researcher_id=res_list[2].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/0554",
            title="Triphala Standardization in Metabolic Syndrome & Gut Microbiome Modulation",
            phase="Phase II",
            status="Active",
            target_enrolment=100,
            current_enrolment=2,
            compliance_score=97.8,
            principal_investigator=res_list[3].full_name,
            researcher_id=res_list[3].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/0890",
            title="Guggulu Compounds for Hyperlipidemia Management: A Multicenter Randomized Trial",
            phase="Phase III",
            status="Recruiting",
            target_enrolment=250,
            current_enrolment=5,
            compliance_score=99.1,
            principal_investigator=res_list[4].full_name,
            researcher_id=res_list[4].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/0998",
            title="Guduchi Immunomodulatory Efficacy in Respiratory Tract Sensitivities",
            phase="Phase II",
            status="Recruiting",
            target_enrolment=80,
            current_enrolment=2,
            compliance_score=98.9,
            principal_investigator=res_list[0].full_name,
            researcher_id=res_list[0].id
        )
    ]

    db.add_all(trials)
    db.commit()
    trial_list = db.query(Trial).all()

    # 6. Seed Patient Contracts (Linking patients to doctors and trials)
    contracts = [
        PatientContract(contract_ref="CNT-2026-001", patient_id=pat_list[0].id, doctor_id=doc_list[0].id, trial_id=trial_list[0].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=10), e_signature="Rahul Patel", ayushman_bharat_id="91-2345-6789-0123"),
        PatientContract(contract_ref="CNT-2026-002", patient_id=pat_list[1].id, doctor_id=doc_list[0].id, trial_id=trial_list[0].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=9), e_signature="Priya Sharma", ayushman_bharat_id="92-3456-7890-1234"),
        PatientContract(contract_ref="CNT-2026-003", patient_id=pat_list[2].id, doctor_id=doc_list[1].id, trial_id=trial_list[1].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=8), e_signature="Amit Verma", ayushman_bharat_id="93-4567-8901-2345"),
        PatientContract(contract_ref="CNT-2026-004", patient_id=pat_list[3].id, doctor_id=doc_list[1].id, trial_id=trial_list[1].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=7), e_signature="Sneha Roy", ayushman_bharat_id="94-5678-9012-3456"),
        PatientContract(contract_ref="CNT-2026-005", patient_id=pat_list[4].id, doctor_id=doc_list[2].id, trial_id=trial_list[2].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=6), e_signature="Vikram Singh", ayushman_bharat_id="95-6789-0123-4567"),
        PatientContract(contract_ref="CNT-2026-006", patient_id=pat_list[5].id, doctor_id=doc_list[2].id, trial_id=trial_list[2].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=5), e_signature="Anita Das", ayushman_bharat_id="96-7890-1234-5678"),
        PatientContract(contract_ref="CNT-2026-007", patient_id=pat_list[6].id, doctor_id=doc_list[3].id, trial_id=trial_list[3].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=4), e_signature="Rohit Mehra", ayushman_bharat_id="97-8901-2345-6789"),
        PatientContract(contract_ref="CNT-2026-008", patient_id=pat_list[7].id, doctor_id=doc_list[3].id, trial_id=trial_list[4].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=3), e_signature="Puja Nandy", ayushman_bharat_id="98-9012-3456-7890"),
        PatientContract(contract_ref="CNT-2026-009", patient_id=pat_list[8].id, doctor_id=doc_list[4].id, trial_id=trial_list[4].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=2), e_signature="Subham Dey", ayushman_bharat_id="99-0123-4567-8901"),
        PatientContract(contract_ref="CNT-2026-010", patient_id=pat_list[9].id, doctor_id=doc_list[4].id, trial_id=trial_list[5].id, status="Active", consent_signed_date=datetime.utcnow() - timedelta(days=1), e_signature="Megha Gupta", ayushman_bharat_id="90-1234-5678-9012")
    ]

    db.add_all(contracts)
    db.commit()

    # 7. Seed Daily Health Logs
    health_logs = [
        DailyHealthLog(patient_id=pat_list[0].id, trial_id=trial_list[0].id, vitals_summary="BP: 120/80 mmHg, Pulse: 72 bpm, Temp: 98.4°F", symptoms_notes="Feeling energetic, good sleep quality."),
        DailyHealthLog(patient_id=pat_list[1].id, trial_id=trial_list[0].id, vitals_summary="BP: 118/76 mmHg, Pulse: 70 bpm, Temp: 98.2°F", symptoms_notes="Mild morning stiffness, otherwise stable."),
        DailyHealthLog(patient_id=pat_list[2].id, trial_id=trial_list[1].id, vitals_summary="BP: 130/85 mmHg, Pulse: 78 bpm, Temp: 98.6°F", symptoms_notes="Joint mobility improved post Basti therapy."),
        DailyHealthLog(patient_id=pat_list[4].id, trial_id=trial_list[2].id, vitals_summary="BP: 122/78 mmHg, Pulse: 68 bpm, Temp: 98.3°F", symptoms_notes="Memory retention tasks completed without fatigue.")
    ]

    db.add_all(health_logs)
    db.commit()

    # 8. Seed Adverse Events & Safety Alarms with Doctor Solutions
    adverse_events = [
        AdverseEvent(
            event_code="AE-2026-01",
            patient_id=pat_list[0].id,
            trial_id=trial_list[0].id,
            severity="Mild",
            meddra_preferred_term="Mild Gastrointestinal Discomfort",
            who_drug_code="WHOD-0921",
            outcome="Recovering",
            regulatory_notified=True,
            doctor_solution="Administer Ashwagandha compound post-meal with warm milk to ease digestion."
        ),
        AdverseEvent(
            event_code="AE-2026-02",
            patient_id=pat_list[2].id,
            trial_id=trial_list[1].id,
            severity="Moderate",
            meddra_preferred_term="Transient Dizziness",
            who_drug_code="WHOD-1104",
            outcome="Resolved",
            regulatory_notified=True,
            doctor_solution="Ensure adequate hydration and electrolyte balance between Panchakarma sessions."
        )
    ]

    db.add_all(adverse_events)
    db.commit()

    # 9. Seed Immutable Audit Logs
    audit_entries = [
        AuditLog(user_id=res_list[0].id, action="CREATE_TRIAL", details=f"Researcher registered trial {trial_list[0].ctri_number}"),
        AuditLog(user_id=doc_list[0].id, action="CREATE_CONTRACT", details=f"Doctor formed official contract for trial {trial_list[0].id}"),
        AuditLog(user_id=pat_list[0].id, action="DAILY_HEALTH_LOG", details="Patient submitted daily vitals and notes."),
        AuditLog(user_id=doc_list[0].id, action="DOCTOR_SOLUTION", details="Doctor dispatched clinical prescription advice for AE-2026-01")
    ]

    db.add_all(audit_entries)
    db.commit()

    print("[Prana Seeder] Synthetic data seeding completed successfully with 5 researchers, 5 doctors, 10 patients, and complete clinical records!")