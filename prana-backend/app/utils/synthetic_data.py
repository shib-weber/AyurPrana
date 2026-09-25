from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.models import User, Trial, PatientContract, AdverseEvent, DailyHealthLog, AuditLog, ResearchDocument, ChatMessage

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_synthetic_data(db: Session):
    # Check if database is already seeded
    if db.query(User.id).first():
        print("[Prana Seeder] Database already contains records. Skipping full re-seed.")
        return

    print("[Prana Seeder] Seeding massive comprehensive AIIA Ayurveda clinical trial dataset...")

    # 1. Seed Government Officials / Regulators (NPvCC) & Investigators
    gov_users = [
        User(username="dr_verma_gov", email="verma.npvcc@ayush.gov.in", hashed_password=pwd_context.hash("password123"), role="gov_official", full_name="Dr. Alok Verma (NPvCC Director)"),
        User(username="sharma_moca", email="sharma.ayush@gov.in", hashed_password=pwd_context.hash("password123"), role="gov_official", full_name="Shreya Sharma (Ministry of Ayush)"),
        User(username="gov_investigator_1", email="iec.chairperson@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="gov_investigator", full_name="Dr. B. K. Patra (IEC Chairperson)")
    ]

    # 2. Seed Researchers (8 Investigators)
    researchers = [
        User(username="dr_sen_research", email="a.sen@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Ananya Sen"),
        User(username="dr_das_research", email="r.das@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Randeep Das"),
        User(username="dr_roy_research", email="m.roy@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Moumita Roy"),
        User(username="dr_bose_research", email="s.bose@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Subrata Bose"),
        User(username="dr_nair_research", email="p.nair@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Priya Nair"),
        User(username="dr_iyer_research", email="k.iyer@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Karthik Iyer"),
        User(username="dr_mehta_research", email="s.mehta@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Swati Mehta"),
        User(username="dr_reddy_research", email="v.reddy@aiia.edu.in", hashed_password=pwd_context.hash("password123"), role="researcher", full_name="Dr. Venkat Reddy")
    ]

    # 3. Seed Doctors (8 Physicians)
    doctors = [
        User(username="dr_mukherjee", email="s.mukherjee@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Soumitra Mukherjee"),
        User(username="dr_banerjee", email="n.banerjee@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Nabanita Banerjee"),
        User(username="dr_chatterjee", email="k.chatterjee@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Kaushik Chatterjee"),
        User(username="dr_ganguly", email="t.ganguly@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Tanusree Ganguly"),
        User(username="dr_ghosh", email="a.ghosh@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Arindam Ghosh"),
        User(username="dr_sen_doc", email="dr.sen@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Debashis Sen"),
        User(username="dr_paul_doc", email="dr.paul@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Sharmila Paul"),
        User(username="dr_kulkarni", email="dr.kulkarni@aiia.gov.in", hashed_password=pwd_context.hash("password123"), role="doctor", full_name="Dr. Milind Kulkarni")
    ]

    # 4. Seed Patients (15 Participants)
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
        User(username="patient_megha", email="megha.gupta@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Megha Gupta"),
        User(username="patient_karan", email="karan.johar@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Karan Johar"),
        User(username="patient_divya", email="divya.khosla@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Divya Khosla"),
        User(username="patient_manish", email="manish.malhotra@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Manish Malhotra"),
        User(username="patient_pooja", email="pooja.hegde@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Pooja Hegde"),
        User(username="patient_arjun", email="arjun.kapoor@gmail.com", hashed_password=pwd_context.hash("password123"), role="patient", full_name="Arjun Kapoor")
    ]

    db.add_all(gov_users + researchers + doctors + patients)
    db.commit()

    # Re-query to get assigned IDs
    res_list = db.query(User).filter(User.role == "researcher").all()
    doc_list = db.query(User).filter(User.role == "doctor").all()
    pat_list = db.query(User).filter(User.role == "patient").all()

    # 5. Seed Clinical Trials (8 Studies mapped to researchers)
    trials = [
        Trial(
            ctri_number="CRDA/AIIA/2026/0142",
            title="Ashwagandha (Withania somnifera) Extract Standardization & Cognitive Efficacy Protocol",
            phase="Phase III",
            status="Recruiting",
            target_enrolment=150,
            current_enrolment=12,
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
            current_enrolment=10,
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
            current_enrolment=8,
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
            current_enrolment=6,
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
            current_enrolment=14,
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
            current_enrolment=5,
            compliance_score=98.9,
            principal_investigator=res_list[5].full_name,
            researcher_id=res_list[5].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/1102",
            title="Shankhpushpi Nootropic Synergy in Pediatric Memory & Focus Disorders",
            phase="Phase II",
            status="Recruiting",
            target_enrolment=90,
            current_enrolment=4,
            compliance_score=99.5,
            principal_investigator=res_list[6].full_name,
            researcher_id=res_list[6].id
        ),
        Trial(
            ctri_number="CRDA/AIIA/2026/1245",
            title="Haridra (Curcuma longa) Nano-Formulation in Inflammatory Joint Care",
            phase="Phase III",
            status="Active",
            target_enrolment=180,
            current_enrolment=9,
            compliance_score=98.2,
            principal_investigator=res_list[7].full_name,
            researcher_id=res_list[7].id
        )
    ]

    db.add_all(trials)
    db.commit()
    trial_list = db.query(Trial).all()

    # 6. Seed Research Documents (Protocols pending and accepted)
    research_docs = [
        ResearchDocument(researcher_id=res_list[0].id, title="Ashwagandha Standardization Protocol v3.2", category="Clinical Trial Protocol", filename="ashwagandha_protocol.pdf", status="Accepted", assigned_crda="CRDA/AIIA/2026/0142"),
        ResearchDocument(researcher_id=res_list[1].id, title="Panchakarma Basti Safety Monograph", category="Safety Monograph", filename="basti_monograph.pdf", status="Accepted", assigned_crda="CRDA/AIIA/2026/0289"),
        ResearchDocument(researcher_id=res_list[2].id, title="Brahmi Neuroplasticity Trial Blueprint", category="Clinical Trial Protocol", filename="brahmi_blueprint.pdf", status="Pending", assigned_crda=None),
        ResearchDocument(researcher_id=res_list[3].id, title="Triphala Gut Microbiome Analysis Plan", category="Ayurvedic Pharmacognosy", filename="triphala_plan.pdf", status="Pending", assigned_crda=None)
    ]
    db.add_all(research_docs)
    db.commit()

    # 7. Seed Patient Contracts (Linking all 15 patients across trials and doctors)
    contracts = []
    for i, pat in enumerate(pat_list):
        assigned_doc = doc_list[i % len(doc_list)]
        assigned_trial = trial_list[i % len(trial_list)]
        contracts.append(
            PatientContract(
                contract_ref=f"CNT-2026-{100+i}",
                patient_id=pat.id,
                doctor_id=assigned_doc.id,
                trial_id=assigned_trial.id,
                status="Active",
                consent_signed_date=datetime.utcnow() - timedelta(days=15-i),
                e_signature=pat.full_name,
                ayushman_bharat_id=f"9{i}-2345-6789-012{i}"
            )
        )

    db.add_all(contracts)
    db.commit()

    # 8. Seed Daily Health Logs
    health_logs = []
    for i, pat in enumerate(pat_list[:10]):
        assigned_trial = trial_list[i % len(trial_list)]
        health_logs.append(
            DailyHealthLog(
                patient_id=pat.id,
                trial_id=assigned_trial.id,
                vitals_summary=f"BP: {115+i}/75 mmHg, Pulse: {70+(i%5)} bpm, Temp: 98.{4+(i%3)}°F",
                log_date=datetime.utcnow() - timedelta(days=i%3),
                symptoms_notes="Feeling stable, medication taken on time with warm water."
            )
        )

    db.add_all(health_logs)
    db.commit()

    # 9. Seed Adverse Events & Safety Alarms with Doctor Solutions
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
        ),
        AdverseEvent(
            event_code="AE-2026-03",
            patient_id=pat_list[4].id,
            trial_id=trial_list[2].id,
            severity="Severe",
            meddra_preferred_term="Acute Mild Headache & Nausea",
            who_drug_code="WHOD-2201",
            outcome="Under Observation",
            regulatory_notified=True,
            doctor_solution="Pause dosage for 24 hours. Prescribed herbal hydration therapy and monitoring vitals."
        )
    ]

    db.add_all(adverse_events)
    db.commit()

    # 10. Seed Realistic Chat Messages (WhatsApp bot check-ins, AI health agent notes, and Doctor DMs)
    chats = [
        ChatMessage(sender_id=pat_list[0].id, recipient_id=doc_list[0].id, message="Namaste Doctor, I took my morning Ashwagandha dose.", timestamp=datetime.utcnow() - timedelta(hours=5)),
        ChatMessage(sender_id=doc_list[0].id, recipient_id=pat_list[0].id, message="Wonderful Rahul. Make sure to report any stomach sensitivity immediately.", timestamp=datetime.utcnow() - timedelta(hours=4)),
        ChatMessage(sender_id=pat_list[0].id, recipient_id=doc_list[0].id, message="🤖 [WhatsApp Bot Check-in]: Daily health log successfully verified. Adherence score 100%.", timestamp=datetime.utcnow() - timedelta(hours=2)),
        ChatMessage(sender_id=pat_list[2].id, recipient_id=doc_list[1].id, message="Hello Sir, feeling slight dizziness after yesterday's therapy.", timestamp=datetime.utcnow() - timedelta(hours=6)),
        ChatMessage(sender_id=doc_list[1].id, recipient_id=pat_list[2].id, message="⚠️ [AI Health Agent Notice]: Transient dizziness flagged. Please rest and drink coconut water.", timestamp=datetime.utcnow() - timedelta(hours=5))
    ]

    db.add_all(chats)
    db.commit()

    # 11. Seed Immutable Audit Logs
    audit_entries = [
        AuditLog(user_id=res_list[0].id, action="CREATE_TRIAL", details=f"Researcher registered trial {trial_list[0].ctri_number}"),
        AuditLog(user_id=doc_list[0].id, action="CREATE_CONTRACT", details=f"Doctor formed official contract for trial {trial_list[0].id}"),
        AuditLog(user_id=pat_list[0].id, action="DAILY_HEALTH_LOG", details="Patient submitted daily vitals and notes."),
        AuditLog(user_id=doc_list[0].id, action="DOCTOR_SOLUTION", details="Doctor dispatched clinical prescription advice for AE-2026-01"),
        AuditLog(user_id=gov_users[2].id, action="IEC_REVIEW", details="IEC Chairperson accepted research protocol submission for CRDA/AIIA/2026/0142")
    ]

    db.add_all(audit_entries)
    db.commit()

    print("[Prana Seeder] Massive synthetic dataset successfully seeded with 3 admins, 8 researchers, 8 doctors, 15 patients, 8 trials, and active chat logs!")