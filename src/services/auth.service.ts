import api from "./api";
import { User } from "../lib/features/auth-slice";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  accountType: "patient";
};

export const loginUser = (
  email: string,
  password: string
) => {
  const payload: LoginPayload = { email, password };
  return api.post("/auth/login/patient", payload);
};



export const registerUser = (
  userData: RegisterPayload
) => {
  return api.post("/auth/register", userData);
};

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data.user;
};
