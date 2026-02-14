import { useState } from "react";
import { Link } from "react-router-dom";
import { useIncidents } from "../hooks/useIncidents";
import IncidentTable from "../components/IncidentTable";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import Filters from "../components/Filters";

export default function IncidentsPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    sort: "created_at",
    order: "desc",
    search: "",
    service: "",
    severity: "",
    status: "",
  });

  const debouncedSearch = useDebounce(query.search);

  const { data, loading } = useIncidents({
    ...query,
    search: debouncedSearch,
  });

  const handleFilterChange = (key: string, value: string) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSortChange = (column: string) => {
    setQuery((prev) => ({
      ...prev,
      sort: column,
      order: prev.order === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  if (loading) {
    return (
      <div className="incident-page">
        <p className="text-gray-600">Loading incidents…</p>
      </div>
    );
  }

  const incidents = data?.data ?? [];

  return (
    <div className="incident-page">
      <header className="incident-header incident-header--spaced">
        <h1>Incident Tracker</h1>
        <Link to="/incident/new" className="btn-primary inline-flex items-center gap-1">
          New Incident
          <span style={{ fontSize: "0.65rem", opacity: 0.9 }}>▼</span>
        </Link>
      </header>

      <Filters
        service={query.service}
        search={query.search}
        severity={query.severity}
        status={query.status}
        onChange={handleFilterChange}
      />

      {incidents.length === 0 ? (
        <p className="py-8 text-gray-500 text-sm">No incidents found.</p>
      ) : (
        <>
          <div className="incident-table-wrap">
              <IncidentTable
              data={incidents}
              onSortChange={handleSortChange}
            />
          </div>
          <Pagination
            page={data!.page}
            limit={data!.limit}
            total={data!.total}
            onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
}
