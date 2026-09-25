from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import auth, trials, contracts, pharmacovigilance, cdisc_fhir, audit, health, chat, documents
from app.utils.synthetic_data import seed_synthetic_data

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed synthetic dataset on startup
db_session = SessionLocal()
try:
    seed_synthetic_data(db_session)
finally:
    db_session.close()

app = FastAPI(
    title="Project Prana CTMS & NPvCC Dashboard",
    description="Real-time cloud-based Clinical Trial Management System and Pharmacovigilance backend for AIIA.",
    version="1.0.0"
)

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routers
app.include_router(auth.router)
app.include_router(trials.router)
app.include_router(contracts.router)
app.include_router(pharmacovigilance.router)
app.include_router(cdisc_fhir.router)
app.include_router(audit.router)  # <--- Added for JSON Audit Stream
app.include_router(health.router) 
app.include_router(chat.router)
app.include_router(documents.router) # <--- Added for Daily Health Logs & Doctor Solutions

@app.get("/")
def root():
    return {
        "project": "Prana CTMS",
        "institution": "All India Institute of Ayurveda (AIIA)",
        "status": "Online & Operational",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("run:app", host="127.0.0.1", port=8000, reload=True)