import api from "./api";

type DoctorId = number | string;
type DateString = string;

export const fetchDoctors = async () => {
  const response = await api.get("/doctors/all");
  return response.data;
};

export const fetchDoctorById = async (doctorId: DoctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const fetchDoctorAvailability = async (doctorId: DoctorId) => {
  const response = await api.get(`/doctors/availability/${doctorId}`);
  return response.data;
};

export const fetchBookedSlots = async (
  doctorId: DoctorId,
  date: DateString
) => {
  const res = await api.get(`/doctors/booked-slots/${doctorId}?date=${date}`);
  return res.data;
};
