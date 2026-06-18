import { apiRequest } from "./client";

// =======================
// REGISTRO
// =======================
export const register = async ({ email, password, phone }) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, phone }),
  });
};

// =======================
// LOGIN
// =======================
export const login = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};
