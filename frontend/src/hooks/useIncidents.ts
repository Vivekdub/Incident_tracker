import { useEffect, useState } from "react";
import { fetchIncidents } from "../api/incidents";
import type { PaginatedIncidents } from "../types/incident";

export function useIncidents(query: any) {
  const [data, setData] = useState<PaginatedIncidents | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchIncidents(query)
      .then(setData)
      .finally(() => setLoading(false));
  }, [JSON.stringify(query)]);

  return { data, loading };
}
