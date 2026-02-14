export type Severity = "SEV1" | "SEV2" | "SEV3" | "SEV4";
export type Status = "OPEN" | "MITIGATED" | "RESOLVED";

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  owner?: string;
  summary?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedIncidents {
  total: number;
  page: number;
  limit: number;
  data: Incident[];
}
