import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchIncidentById, updateIncident } from "../api/incidents";
import type { Incident, Severity, Status } from "../types/incident";
import StatusBadge from "../components/StatusBadge";

const SEVERITIES: Severity[] = ["SEV1", "SEV2", "SEV3", "SEV4"];
const STATUSES: Status[] = ["OPEN", "MITIGATED", "RESOLVED"];

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [severity, setSeverity] = useState<Severity>("SEV1");
  const [status, setStatus] = useState<Status>("OPEN");
  const [owner, setOwner] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No incident ID provided.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchIncidentById(id)
      .then((data) => {
        if (!cancelled) {
          setIncident(data);
          setSeverity(data.severity);
          setStatus(data.status);
          setOwner(data.owner ?? "");
          setSummary(data.summary ?? "");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.response?.status === 404
              ? "Incident not found."
              : err?.message ?? "Failed to load incident."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = () => {
    if (!id || !incident) return;
    setSaving(true);
    updateIncident(id, { severity, status, owner: owner || undefined, summary: summary || undefined })
      .then((updated) => {
        setIncident(updated);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to save.");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="incident-page">
        <p className="text-gray-600">Loading incident…</p>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="incident-page">
        <p className="text-red-600">{error ?? "Incident not found."}</p>
        <Link to="/" className="incident-back-link mt-2">
          ← Back to incidents
        </Link>
      </div>
    );
  }

  const occurredAt = incident.created_at
    ? new Date(incident.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="incident-page max-w-2xl">
      <header className="incident-header">
        <h1>Incident Tracker</h1>
      </header>
      <Link to="/" className="incident-back-link">
        ← Back to incidents
      </Link>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">{incident.title}</h2>

      <div className="incident-detail-panel space-y-4">
        <div>
          <label className="incident-label">Service:</label>
          <p className="mt-1 text-gray-900 text-sm">{incident.service}</p>
        </div>
        <div>
          <label className="incident-label">Severity:</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity)}
            className="incident-select mt-1 max-w-[140px]"
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="incident-label">Status:</label>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="incident-select max-w-[180px]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <StatusBadge status={status} />
          </div>
        </div>
        <div>
          <label className="incident-label">Assigned To:</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="incident-input mt-1 max-w-xs"
          />
        </div>
        <div>
          <label className="incident-label">Occurred At:</label>
          <p className="mt-1 text-gray-900 text-sm">{occurredAt}</p>
        </div>
        <div>
          <label className="incident-label">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="incident-textarea mt-1"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
