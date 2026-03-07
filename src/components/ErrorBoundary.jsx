import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#0A0E17",
            color: "#F8FAFC",
            p: 3,
            textAlign: "center",
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: "#FF3131", mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8", mb: 3 }}>
            An unexpected error occurred in this component.
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#39FF14", color: "#000", fontWeight: "bold" }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
