import api from "./api";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = any; // tighten later if you want

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

export const fetchCurrentUser = () => {
  return api.get("/auth/me");
};
