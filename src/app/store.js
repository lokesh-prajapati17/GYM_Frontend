import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import vrThemeReducer from "../features/vr/vrThemeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    vrTheme: vrThemeReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
