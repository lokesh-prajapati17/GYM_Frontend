import { createTheme, alpha } from "@mui/material/styles";

const neonGreen = "#39FF14";
const neonOrange = "#FF6B35";
const neonRed = "#FF3131";
const neonCyan = "#00F5FF";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: neonGreen,
      light: "#6FFF4F",
      dark: "#1DB00E",
      contrastText: "#0A0A0A",
    },
    secondary: {
      main: neonOrange,
      light: "#FF8F5E",
      dark: "#CC4F1A",
      contrastText: "#0A0A0A",
    },
    error: {
      main: neonRed,
      light: "#FF6B6B",
      dark: "#CC1A1A",
    },
    warning: {
      main: "#FFB800",
      light: "#FFD54F",
      dark: "#CC9300",
    },
    info: {
      main: neonCyan,
      light: "#4FF8FF",
      dark: "#00B8C4",
    },
    success: {
      main: neonGreen,
      light: "#6FFF4F",
      dark: "#1DB00E",
    },
    background: {
      default: "#0A0E17",
      paper: "#111827",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
    divider: alpha("#94A3B8", 0.12),
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(57, 255, 20, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0, 245, 255, 0.03) 0%, transparent 50%)",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0A0E17",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(neonGreen, 0.3),
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: alpha(neonGreen, 0.5),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: "0.875rem",
          fontWeight: 600,
          boxShadow: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: `0 4px 20px ${alpha(neonGreen, 0.3)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${neonGreen} 0%, #00E676 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, #6FFF4F 0%, ${neonGreen} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${neonOrange} 0%, #FF8A50 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, #FF8F5E 0%, ${neonOrange} 100%)`,
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha("#111827", 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha("#94A3B8", 0.08)}`,
          borderRadius: 16,
          transition: "all 0.3s ease",
          "&:hover": {
            border: `1px solid ${alpha(neonGreen, 0.15)}`,
            boxShadow: `0 8px 32px ${alpha("#000", 0.3)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0D1117",
          borderRight: `1px solid ${alpha("#94A3B8", 0.08)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#0D1117", 0.9),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha("#94A3B8", 0.08)}`,
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(neonGreen, 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: neonGreen,
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha("#94A3B8", 0.08)}`,
        },
        head: {
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          color: "#94A3B8",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111827",
          border: `1px solid ${alpha("#94A3B8", 0.1)}`,
          borderRadius: 16,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${alpha(neonGreen, 0.3)}`,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: alpha("#94A3B8", 0.1),
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default darkTheme;
