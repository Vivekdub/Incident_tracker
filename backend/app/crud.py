from sqlalchemy.orm import Session
from app.models import Incident
from app.schemas import IncidentCreate
from sqlalchemy import or_, desc, asc
from app.models import Incident

def create_incident(db: Session, incident: IncidentCreate):
    db_incident = Incident(**incident.dict())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

def get_incidents(
    db: Session,
    page: int,
    limit: int,
    service: str | None,
    severity: str | None,
    status: str | None,
    search: str | None,
    sort: str,
    order: str
):
    query = db.query(Incident)

    if service:
        query = query.filter(Incident.service == service)

    if severity:
        query = query.filter(Incident.severity == severity)

    if status:
        query = query.filter(Incident.status == status)

    if search:
        query = query.filter(
            or_(
                Incident.title.ilike(f"%{search}%"),
                Incident.service.ilike(f"%{search}%")
            )
        )

    sort_column = getattr(Incident, sort, Incident.created_at)
    query = query.order_by(desc(sort_column) if order == "desc" else asc(sort_column))

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    return items, total


def get_incident_by_id(db: Session, incident_id):
    return db.query(Incident).filter(Incident.id == incident_id).first()

def update_incident(db: Session, incident, updates):
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(incident, key, value)

    db.commit()
    db.refresh(incident)
    return incident

