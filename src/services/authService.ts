import api from "../lib/axios"

export async function login(username: string, password: string) {
  const response = await api.post("/users/login", { username, password })
  return response.data // { token: ... }
}

export async function createUser(username: string, email: string) {
  const response = await api.post("/users/create", { username, email });
  return response.data;
}

export async function activateUser(token: string) {
  const response = await api.get("/users/activate", { params: { token } });
  return response.data;
}
