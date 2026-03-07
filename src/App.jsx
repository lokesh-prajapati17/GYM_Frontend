import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./app/store";
import darkTheme from "./theme/darkTheme";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import FeatureRoute from "./routes/FeatureRoute";
import AppLayout from "./components/layout/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchMe } from "./features/auth/authSlice";

// Lazy loaded pages for code splitting
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const DashboardPage = lazy(
  () => import("./features/dashboard/pages/DashboardPage"),
);
const MembersPage = lazy(() => import("./features/members/pages/MembersPage"));
const MembershipsPage = lazy(
  () => import("./features/membership/pages/MembershipsPage"),
);
const PaymentsPage = lazy(
  () => import("./features/payments/pages/PaymentsPage"),
);
const AttendancePage = lazy(
  () => import("./features/attendance/pages/AttendancePage"),
);
const WorkoutsPage = lazy(
  () => import("./features/workout/pages/WorkoutsPage"),
);
const BMIPage = lazy(() => import("./features/workout/pages/BMIPage"));
const NotificationsPage = lazy(
  () => import("./features/notifications/pages/NotificationsPage"),
);
const TrainersPage = lazy(() => import("./features/trainers/TrainersPage"));
const GymScene = lazy(() => import("./components/threejs/GymScene"));
const EquipmentPage = lazy(
  () => import("./features/equipment/pages/EquipmentPage"),
);
const BranchManagementPage = lazy(
  () => import("./features/branches/pages/BranchManagementPage"),
);
const FloorManagement = lazy(
  () => import("./features/floors/pages/FloorManagement"),
);

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

const AppContent = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

  return (
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
                  <RoleRoute roles={["owner", "admin", "trainer"]}>
                    <MembersPage />
                  </RoleRoute>
                }
              />
              <Route
                path="trainers"
                element={
                  <RoleRoute roles={["owner", "admin"]}>
                    <TrainersPage />
                  </RoleRoute>
                }
              />
              <Route
                path="memberships"
                element={
                  <RoleRoute roles={["owner", "admin"]}>
                    <MembershipsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="payments"
                element={
                  <RoleRoute roles={["owner", "admin", "member"]}>
                    <PaymentsPage />
                  </RoleRoute>
                }
              />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="workouts" element={<WorkoutsPage />} />
              <Route path="bmi" element={<BMIPage />} />
              <Route
                path="equipment"
                element={
                  <RoleRoute roles={["owner", "admin"]}>
                    <EquipmentPage />
                  </RoleRoute>
                }
              />
              <Route
                path="branches"
                element={
                  <RoleRoute roles={["owner"]}>
                    <BranchManagementPage />
                  </RoleRoute>
                }
              />
              <Route
                path="gym-view"
                element={
                  <FeatureRoute feature="vrEnabled">
                    <GymScene />
                  </FeatureRoute>
                }
              />
              <Route
                path="floor-management"
                element={
                  <RoleRoute roles={["owner", "admin"]}>
                    <FeatureRoute feature="multiCitySupport">
                      <FloorManagement />
                    </FeatureRoute>
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
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
