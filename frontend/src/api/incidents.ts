import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const fetchIncidents = async (params: any) => {
  const res = await api.get("/incidents", { params });
  return res.data;
};

export const fetchIncidentById = async (id: string) => {
  const res = await api.get(`/incidents/${id}`);
  return res.data;
};

export const updateIncident = async (id: string, data: any) => {
  const res = await api.patch(`/incidents/${id}`, data);
  return res.data;
};

export const createIncident = async (data: any) => {
  const res = await api.post("/incidents", data);
  return res.data;
};
