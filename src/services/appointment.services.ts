import api from "./api";

type AppointmentData = any;
type PaymentData = any;

export const createAppointment = async (appointmentData: AppointmentData) => {
  const response = await api.post("/appointments/book", appointmentData);
  return response.data;
};
export const myAppointments = async () => {
  const response = await api.get("/appointments/mybookings");
  return response.data;
};

export const getAppointmentById = async (appointmentId: number | string) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data;
};

export const cancelAppointment = async (appointmentId: number | string) => {
  const response = await api.put(`/appointments/cancel/${appointmentId}`);
  return response.data;
};

export const payAppointment = async (paymentData: PaymentData) => {
  const response = await api.post("/payments/process", paymentData);
  return response.data;
};

export const fetchAppointments = async () => {
  const response = await api.get("/appointments/all");
  return response.data;
};

export const updateAppointmentStatus = async (
  appointmentId: number | string,
  status: string
) => {
  const response = await api.put(`/appointments/status/${appointmentId}`, {
    status,
  });
  return response.data;
};

export const getAppointmentsByDoctor = async (doctorId: number | string) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};