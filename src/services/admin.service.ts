import api from "./api";

export const fetchPatients = async () => {
  const response = await api.get("/admin/patients/all");
  return response.data;
};

export const getPatientById = async (patientId: number | string) => {
  const response = await api.get(`/admin/patients/${patientId}`);
  return response.data;
};

export const deletePatientById = async (patientId: number | string) => {
  const response = await api.delete(`/admin/patients/${patientId}`);
  return response.data;
};