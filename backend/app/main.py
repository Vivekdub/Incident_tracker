from fastapi import FastAPI
from app.database import Base, engine
from app.routes.incidents import router as incident_router
from fastapi.middleware.cors import CORSMiddleware



Base.metadata.create_all(bind=engine)

app = FastAPI(title="Incident Tracker")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(incident_router)

@app.get("/health")
def health():
    return {"status": "ok"}
