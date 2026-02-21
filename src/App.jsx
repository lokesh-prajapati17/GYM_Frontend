import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./app/store";
import darkTheme from "./theme/darkTheme";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import AppLayout from "./components/layout/AppLayout";

// Lazy loaded pages for code splitting
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const MembersPage = lazy(() => import("./features/members/MembersPage"));
const MembershipsPage = lazy(
  () => import("./features/membership/MembershipsPage"),
);
const PaymentsPage = lazy(() => import("./features/payments/PaymentsPage"));
const AttendancePage = lazy(
  () => import("./features/attendance/AttendancePage"),
);
const WorkoutsPage = lazy(() => import("./features/workout/WorkoutsPage"));
const BMIPage = lazy(() => import("./features/workout/BMIPage"));
const NotificationsPage = lazy(
  () => import("./features/notifications/NotificationsPage"),
);
const TrainersPage = lazy(() => import("./features/trainers/TrainersPage"));
const GymScene = lazy(() => import("./components/threejs/GymScene"));
const FloorManagement = lazy(() => import("./features/floors/FloorManagement"));

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress sx={{ color: "#39FF14" }} size={48} />
  </Box>
);

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1E293B",
              color: "#F1F5F9",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "12px",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#39FF14", secondary: "#0A0A0A" },
            },
            error: { iconTheme: { primary: "#FF3131", secondary: "#fff" } },
          }}
        />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route
                  path="members"
                  element={
                    <RoleRoute roles={["admin", "trainer"]}>
                      <MembersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="trainers"
                  element={
                    <RoleRoute roles={["admin", "trainer"]}>
                      <TrainersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="memberships"
                  element={
                    <RoleRoute roles={["admin"]}>
                      <MembershipsPage />
                    </RoleRoute>
                  }
                />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="workouts" element={<WorkoutsPage />} />
                <Route path="bmi" element={<BMIPage />} />
                <Route path="gym-view" element={<GymScene />} />
                <Route
                  path="floor-management"
                  element={
                    <RoleRoute roles={["admin"]}>
                      <FloorManagement />
                    </RoleRoute>
                  }
                />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<DashboardPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
