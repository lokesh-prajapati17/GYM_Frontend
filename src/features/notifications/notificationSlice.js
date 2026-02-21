import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    unreadCount: 0,
    items: [],
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, addNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
