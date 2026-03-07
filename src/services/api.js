import axios from "axios";
import { BASE_URL } from "./constants";
import { decryptData } from "../utils/cryptoUtils";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token and branch context
api.interceptors.request.use(
  (config) => {
    const token = decryptData(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Send active branch for server-side scoping
    const activeBranchId = localStorage.getItem("activeBranchId");
    if (activeBranchId) {
      config.headers["x-branch-id"] = activeBranchId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
