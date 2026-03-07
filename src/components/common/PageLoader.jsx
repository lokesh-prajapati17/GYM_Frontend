import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PageLoader = ({ overlay = false }) => {
  const theme = useTheme();

  if (overlay) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(10, 14, 23, 0.7)"
              : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 10,
          borderRadius: "inherit",
        }}
      >
        <CircularProgress
          sx={{ color: theme.palette.primary.main }}
          size={48}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        width: "100%",
      }}
    >
      <CircularProgress sx={{ color: theme.palette.primary.main }} size={48} />
    </Box>
  );
};

export default PageLoader;
