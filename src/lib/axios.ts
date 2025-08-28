import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Updated base URL
})

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add a response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("jwtToken")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export default api
