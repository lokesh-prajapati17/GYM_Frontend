import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  alpha,
  Alert,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  Email,
  Lock,
  StoreMallDirectory,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { login, selectBranch, clearError } from "../authSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, branchSelectionRequired, branches } =
    useSelector((state) => state.auth);

  useEffect(() => {
    // Navigate to dashboard only if logged in and no branch selection pending
    if (user && !branchSelectionRequired) navigate("/dashboard");
    return () => dispatch(clearError());
  }, [user, branchSelectionRequired, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleBranchSelect = (branchId) => {
    dispatch(selectBranch({ branchId }));
  };

  // --- Branch Selection View ---
  if (user && branchSelectionRequired) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0A0E17 0%, #111827 40%, #0A0E17 100%)",
          p: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 440,
              p: 4,
              background: alpha("#111827", 0.9),
              backdropFilter: "blur(30px)",
              border: `1px solid ${alpha("#39FF14", 0.1)}`,
              boxShadow: `0 20px 60px ${alpha("#000", 0.5)}, 0 0 40px ${alpha("#39FF14", 0.05)}`,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  mx: "auto",
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #39FF14 0%, #00E676 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${alpha("#39FF14", 0.3)}`,
                }}
              >
                <StoreMallDirectory sx={{ color: "#0A0A0A", fontSize: 36 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Outfit",
                  fontWeight: 800,
                  color: "#F1F5F9",
                }}
              >
                Select Branch
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
                Welcome, {user.name}! Choose a branch to continue.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <List sx={{ width: "100%" }}>
              {branches.map((branch, index) => (
                <motion.div
                  key={branch._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItemButton
                    onClick={() => handleBranchSelect(branch._id)}
                    disabled={isLoading}
                    sx={{
                      mb: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${alpha("#39FF14", 0.15)}`,
                      bgcolor: alpha("#1E293B", 0.5),
                      "&:hover": {
                        bgcolor: alpha("#39FF14", 0.08),
                        borderColor: alpha("#39FF14", 0.4),
                      },
                      transition: "all 0.2s ease",
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon>
                      <StoreMallDirectory
                        sx={{ color: "#39FF14", fontSize: 28 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#F1F5F9",
                            fontSize: "1rem",
                          }}
                        >
                          {branch.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                          {branch.floorCount} floor
                          {branch.floorCount > 1 ? "s" : ""}
                          {branch.vrEnabled && " • VR Enabled"}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </motion.div>
              ))}
            </List>

            {isLoading && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <CircularProgress size={24} sx={{ color: "#39FF14" }} />
              </Box>
            )}
          </Card>
        </motion.div>
      </Box>
    );
  }

  // --- Login Form View ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0A0E17 0%, #111827 40%, #0A0E17 100%)",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#39FF14", 0.06)} 0%, transparent 70%)`,
          top: -150,
          right: -100,
          animation: "pulse 4s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#00F5FF", 0.05)} 0%, transparent 70%)`,
          bottom: -100,
          left: -50,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 440,
            p: 4,
            background: alpha("#111827", 0.9),
            backdropFilter: "blur(30px)",
            border: `1px solid ${alpha("#39FF14", 0.1)}`,
            boxShadow: `0 20px 60px ${alpha("#000", 0.5)}, 0 0 40px ${alpha("#39FF14", 0.05)}`,
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #39FF14 0%, #00E676 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 32px ${alpha("#39FF14", 0.3)}`,
              }}
            >
              <FitnessCenter sx={{ color: "#0A0A0A", fontSize: 36 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontFamily: "Outfit", fontWeight: 800, color: "#F1F5F9" }}
            >
              GymPro
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              Sign in to manage your fitness empire
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5, fontSize: "1rem", fontWeight: 700, mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#0A0A0A" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Divider
            sx={{
              my: 2,
              "&::before, &::after": { borderColor: alpha("#94A3B8", 0.1) },
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              OR
            </Typography>
          </Divider>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#94A3B8" }}
          >
            Don't have an account?{" "}
            <Typography
              component={Link}
              to="/register"
              variant="body2"
              sx={{
                color: "#39FF14",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign Up
            </Typography>
          </Typography>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
