import { createSlice } from "@reduxjs/toolkit";

// 4 preset themes that apply GLOBALLY across the entire app
const themePresets = {
  neon: {
    name: "Neon Fitness",
    primary: "#39FF14",
    secondary: "#00F5FF",
    accent: "#FF6B35",
    ambient: "#00ff99",
    hotspot: "#39FF14",
    background: "#0A0E17",
    surface: "#111827",
    danger: "#FF3131",
    warning: "#FFB800",
  },
  gold: {
    name: "Premium Gold",
    primary: "#FFD700",
    secondary: "#FFA500",
    accent: "#DAA520",
    ambient: "#FFD700",
    hotspot: "#FFD700",
    background: "#0A0A0A",
    surface: "#1A1A1A",
    danger: "#FF4444",
    warning: "#FFA500",
  },
  red: {
    name: "Intense Red",
    primary: "#FF3131",
    secondary: "#FF6B6B",
    accent: "#FF1744",
    ambient: "#FF3131",
    hotspot: "#FF4444",
    background: "#0D0000",
    surface: "#1A0A0A",
    danger: "#FF1744",
    warning: "#FF6B35",
  },
  blue: {
    name: "Modern Blue",
    primary: "#00F5FF",
    secondary: "#3B82F6",
    accent: "#6366F1",
    ambient: "#00F5FF",
    hotspot: "#00D4FF",
    background: "#020617",
    surface: "#0F172A",
    danger: "#EF4444",
    warning: "#F59E0B",
  },
};

// Load saved theme from localStorage
const loadSavedTheme = () => {
  try {
    const saved = localStorage.getItem("gymTheme");
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saved = loadSavedTheme();

const initialState = {
  activeTheme: saved?.activeTheme || "neon",
  colors: saved?.colors || themePresets.neon,
  brightness: saved?.brightness ?? 1.0,
  presets: themePresets,
};

const vrThemeSlice = createSlice({
  name: "vrTheme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const themeName = action.payload;
      if (themePresets[themeName]) {
        state.activeTheme = themeName;
        state.colors = themePresets[themeName];
        localStorage.setItem("gymTheme", JSON.stringify(state));
      }
    },
    setCustomColor: (state, action) => {
      const { key, value } = action.payload;
      if (state.colors[key] !== undefined) {
        state.colors[key] = value;
        state.activeTheme = "custom";
        localStorage.setItem("gymTheme", JSON.stringify(state));
      }
    },
    setBrightness: (state, action) => {
      state.brightness = Math.max(0.3, Math.min(2.0, action.payload));
      localStorage.setItem("gymTheme", JSON.stringify(state));
    },
    resetTheme: (state) => {
      state.activeTheme = "neon";
      state.colors = themePresets.neon;
      state.brightness = 1.0;
      localStorage.setItem("gymTheme", JSON.stringify(state));
    },
  },
});

export const { setTheme, setCustomColor, setBrightness, resetTheme } =
  vrThemeSlice.actions;

export const selectThemeColors = (state) => state.vrTheme.colors;
export const selectActiveTheme = (state) => state.vrTheme.activeTheme;
export const selectBrightness = (state) => state.vrTheme.brightness;
export const selectPresets = (state) => state.vrTheme.presets;

export default vrThemeSlice.reducer;
