from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import IncidentCreate, IncidentResponse
from app.crud import create_incident,get_incidents,get_incident_by_id,update_incident
from fastapi import Query
from app.schemas import IncidentUpdate, PaginatedIncidents
from uuid import UUID
router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.post(
    "",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_incident_endpoint(
    incident: IncidentCreate,
    db: Session = Depends(get_db)
):
    return create_incident(db, incident)


@router.get("", response_model=PaginatedIncidents)
def list_incidents(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=100),
    service: str | None = None,
    severity: str | None = None,
    status: str | None = None,
    search: str | None = None,
    sort: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db)
):
    incidents, total = get_incidents(
        db, page, limit, service, severity, status, search, sort, order
    )
    print(incidents)

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": incidents
    }

from fastapi import HTTPException

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
    incident_id: UUID,
    db: Session = Depends(get_db)
):
    incident = get_incident_by_id(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident



@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident_endpoint(
    incident_id: UUID,
    updates: IncidentUpdate,
    db: Session = Depends(get_db)
):
    incident = get_incident_by_id(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    return update_incident(db, incident, updates)
