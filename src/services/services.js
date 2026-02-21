import api from "./api";

// Auth
export const authService = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/password", data),
};

// Members
export const memberService = {
  getAll: (params) => api.get("/members", { params }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post("/members", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Memberships
export const membershipService = {
  getAll: () => api.get("/memberships"),
  getById: (id) => api.get(`/memberships/${id}`),
  create: (data) => api.post("/memberships", data),
  update: (id, data) => api.put(`/memberships/${id}`, data),
  delete: (id) => api.delete(`/memberships/${id}`),
};

// Payments
export const paymentService = {
  getAll: (params) => api.get("/payments", { params }),
  create: (data) => api.post("/payments", data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  getRevenueStats: () => api.get("/payments/stats/revenue"),
};

// Attendance
export const attendanceService = {
  getAll: (params) => api.get("/attendance", { params }),
  mark: (data) => api.post("/attendance", data),
  getPercentage: (memberId, days) =>
    api.get(`/attendance/percentage/${memberId}`, { params: { days } }),
};

// Workouts
export const workoutService = {
  getAll: (params) => api.get("/workouts", { params }),
  create: (data) => api.post("/workouts", data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

// Notifications
export const notificationService = {
  getAll: (params) => api.get("/notifications", { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  create: (data) => api.post("/notifications", data),
};

// Dashboard
export const dashboardService = {
  getAdmin: () => api.get("/dashboard/admin"),
  getTrainer: () => api.get("/dashboard/trainer"),
  getMember: () => api.get("/dashboard/member"),
  getTrainers: () => api.get("/dashboard/trainers"),
};

// Floors (AR/VR)
export const floorService = {
  getAll: () => api.get("/floors"),
  getById: (id) => api.get(`/floors/${id}`),
  create: (formData) =>
    api.post("/floors", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/floors/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/floors/${id}`),
  updateHotspots: (id, hotspots) =>
    api.put(`/floors/${id}/hotspots`, { hotspots }),
};
