import api from "../lib/axios"

export async function login(username: string, password: string) {
  const response = await api.post("/users/login", { username, password })
  return response.data // { token: ... }
}
