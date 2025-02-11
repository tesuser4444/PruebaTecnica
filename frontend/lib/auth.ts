import axios from "axios";

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await axios.post("/api/auth/login", credentials);
  localStorage.setItem("token", data.token);
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  return token ? JSON.parse(atob(token.split(".")[1])) : null;
};