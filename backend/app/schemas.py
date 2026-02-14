from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models import SeverityEnum, StatusEnum
from uuid import UUID
from typing import List

class IncidentCreate(BaseModel):
    title: str
    service: str
    severity: SeverityEnum
    status: Optional[StatusEnum] = StatusEnum.OPEN
    owner: Optional[str] = None
    summary: Optional[str] = None

class IncidentResponse(BaseModel):
    id: UUID
    title: str
    service: str
    severity: SeverityEnum
    status: StatusEnum
    owner: Optional[str]
    summary: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class PaginatedIncidents(BaseModel):
    total: int
    page: int
    limit: int
    data: List[IncidentResponse]

class IncidentUpdate(BaseModel):
    severity: Optional[SeverityEnum] = None
    status: Optional[StatusEnum] = None
    owner: Optional[str] = None
    summary: Optional[str] = None
