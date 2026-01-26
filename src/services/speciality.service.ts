import api from "./api";
type SpecialityId = number | string;



export const fetchSpecialities = async () => {
  const response = await api.get("/specialities/all");
  return response.data;
};

export const fetchSpecialityById = async (specialityId: SpecialityId) => {
  const response = await api.get(`/specialities/${specialityId}`);
  return response.data;
};