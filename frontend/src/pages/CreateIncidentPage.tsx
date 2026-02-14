import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createIncident } from "../api/incidents";
import type { Severity, Status } from "../types/incident";

const SERVICE_OPTIONS = ["Auth", "Payments", "Backend", "Frontend", "Database"];
const SEVERITIES: Severity[] = ["SEV1", "SEV2", "SEV3", "SEV4"];
const STATUSES: Status[] = ["OPEN", "MITIGATED", "RESOLVED"];

export default function CreateIncidentPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [severity, setSeverity] = useState<Severity>("SEV1");
  const [status, setStatus] = useState<Status>("OPEN");
  const [owner, setOwner] = useState("");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!service.trim()) {
      setError("Service is required.");
      return;
    }
    setError(null);
    setSubmitting(true);
    createIncident({
      title: title.trim(),
      service: service.trim(),
      severity,
      status,
      owner: owner.trim() || undefined,
      summary: summary.trim() || undefined,
    })
      .then((created) => {
        navigate(`/incident/${created.id}`);
      })
      .catch((err) => {
        setError(err?.response?.data?.detail ?? err?.message ?? "Failed to create incident.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="incident-page max-w-2xl">
      <header className="incident-header">
        <h1>Incident Tracker</h1>
      </header>
      <Link to="/" className="incident-back-link">
        ← Back to incidents
      </Link>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Incident</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <div>
          <label className="incident-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue Title..."
            className="incident-input"
          />
        </div>
        <div>
          <label className="incident-label">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="incident-select max-w-[200px]"
          >
            <option value="">Select Service</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="incident-label">Severity</label>
          <div className="flex gap-4 mt-1">
            {SEVERITIES.map((s) => (
              <label key={s} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="severity"
                  value={s}
                  checked={severity === s}
                  onChange={() => setSeverity(s)}
                  className="border-gray-300 text-gray-700"
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="incident-label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="incident-select max-w-[200px]"
          >
            <option value="">Select Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="incident-label">Assigned To:</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Optional"
            className="incident-input max-w-xs"
          />
        </div>
        <div>
          <label className="incident-label">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe the incident..."
            rows={4}
            className="incident-textarea"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "Creating…" : "Create Incident"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
