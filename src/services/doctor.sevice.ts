import api from "./api";

type DoctorId = number | string;
type DateString = string;

export interface DoctorApplicationPayload {
  fullName: string;
  speciality_id: number;
  years_of_experience: number;
  email: string;
  phone: string;
  gender?: string;
}

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

export const makeDoctorApplication = async (
  applicationData: DoctorApplicationPayload
) => {
  const response = await api.post("/doctors/makeapplication", applicationData);
  return response.data;
};

export const fetchDoctorApplications = async () => {
  const response = await api.get("/admin/doctors/applications");
  return response.data;
};

export const approveDoctorApplication = async (applicationId: number | string) => {
  const response = await api.post(
    `/admin/doctors/applications/approve/${applicationId}`
  );
  return response.data;
};

export const rejectDoctorApplication = async (applicationId: number | string) => {
  const response = await api.post(
    `/admin/doctors/applications/reject/${applicationId}`
  );
  return response.data;
};
