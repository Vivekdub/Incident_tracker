type Props = {
  service: string;
  search: string;
  severity: string;
  status: string;
  onChange: (key: string, value: string) => void;
};

const SERVICE_OPTIONS = ["", "Auth", "Payments", "Backend", "Frontend", "Database"];
const SEVERITIES = ["SEV1", "SEV2", "SEV3", "SEV4"] as const;

export default function Filters({
  service,
  search,
  severity,
  status,
  onChange,
}: Props) {
  return (
    <div className="filters-section">
      <div className="filters-row filters-row--first">
        <select
          value={service}
          onChange={(e) => onChange("service", e.target.value)}
          className="incident-select filters-service"
        >
          <option value="">Service</option>
          {SERVICE_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="filters-severity">
          <span className="filters-severity-label">Severity:</span>
          <div className="filters-severity-options">
            {SEVERITIES.map((sev) => (
              <label key={sev} className="filters-severity-item">
                <input
                  type="checkbox"
                  checked={severity === sev}
                  onChange={() => onChange("severity", severity === sev ? "" : sev)}
                  className="rounded border-gray-300 text-gray-700"
                />
                <span>{sev}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filters-row filters-row--second">
        <select
          value={status}
          onChange={(e) => onChange("status", e.target.value)}
          className="incident-select filters-status"
        >
          <option value="">Status</option>
          <option value="OPEN">Open</option>
          <option value="MITIGATED">Mitigated</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onChange("search", e.target.value)}
          className="incident-input filters-search"
        />

        <button type="button" className="btn-primary">
          Filter
        </button>
      </div>
    </div>
  );
}
