import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./services/authService";
import { encryptData, decryptData } from "../../utils/cryptoUtils";

const storedUser = decryptData(localStorage.getItem("user"), true) || null;
const storedToken = decryptData(localStorage.getItem("token")) || null;
const storedSubscription = decryptData(localStorage.getItem("subscription"), true) || null;
const storedActiveBranchId = localStorage.getItem("activeBranchId") || null;

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials);
      const { token, user, subscription, branches } = data.data;
      localStorage.setItem("token", encryptData(token));
      localStorage.setItem("user", encryptData(user));
      localStorage.setItem("subscription", encryptData(subscription));
      if (user.defaultBranchId) {
        localStorage.setItem("activeBranchId", user.defaultBranchId);
      }
      return { token, user, subscription, branches };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getMe();
      const { user, subscription, branches } = data.data;
      localStorage.setItem("user", encryptData(user));
      localStorage.setItem("subscription", encryptData(subscription));
      return { user, subscription, branches };
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("subscription");
        localStorage.removeItem("activeBranchId");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(userData);
      localStorage.setItem("token", encryptData(data.data.token));
      localStorage.setItem("user", encryptData(data.data));
      if (data.data.defaultBranchId) {
        localStorage.setItem("activeBranchId", data.data.defaultBranchId);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const selectBranch = createAsyncThunk(
  "auth/selectBranch",
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const { data } = await authService.selectBranch({ branchId });
      // Update token with branch context
      localStorage.setItem("token", encryptData(data.data.token));
      const currentUser = decryptData(localStorage.getItem("user"), true) || {};
      currentUser.branchId = data.data.branchId;
      localStorage.setItem("user", encryptData(currentUser));
      localStorage.setItem("activeBranchId", data.data.branchId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Branch selection failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    subscription: storedSubscription || null,
    branches: [],
    activeBranchId: storedActiveBranchId || (storedUser ? storedUser.defaultBranchId : null),
    isLoading: false,
    error: null,
    branchSelectionRequired: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.subscription = null;
      state.branches = [];
      state.error = null;
      state.branchSelectionRequired = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("subscription");
      localStorage.removeItem("activeBranchId");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.subscription = action.payload.subscription;
        state.branches = action.payload.branches || [];
        state.activeBranchId = action.payload.user?.defaultBranchId || null;
        // Check if branch selection is needed (multiple branches available)
        const branches = action.payload.branches || [];
        state.branchSelectionRequired = branches.length > 1 && !action.payload.user.branchId;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.activeBranchId = action.payload.defaultBranchId || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(selectBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branchSelectionRequired = false;
        if (state.user) {
          state.user.branchId = action.payload.branchId;
        }
        state.activeBranchId = action.payload.branchId;
        state.token = action.payload.token;
      })
      .addCase(selectBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.subscription = action.payload.subscription;
        state.branches = action.payload.branches || [];
        if (!state.activeBranchId && action.payload.user?.defaultBranchId) {
          state.activeBranchId = action.payload.user.defaultBranchId;
          localStorage.setItem("activeBranchId", action.payload.user.defaultBranchId);
        }
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.includes?.("invalid") || action.payload?.includes?.("expire")) {
          state.user = null;
          state.token = null;
          state.subscription = null;
          state.branches = [];
          state.activeBranchId = null;
          state.branchSelectionRequired = false;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
