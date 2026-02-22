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
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  Email,
  Lock,
  Person,
  Phone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { register, clearError } from "../authSlice";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "member",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/dashboard");
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

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
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#FF6B35", 0.06)} 0%, transparent 70%)`,
          top: -150,
          left: -100,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 440,
            p: 4,
            background: alpha("#111827", 0.9),
            backdropFilter: "blur(30px)",
            border: `1px solid ${alpha("#39FF14", 0.1)}`,
            boxShadow: `0 20px 60px ${alpha("#000", 0.5)}`,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitnessCenter sx={{ color: "#0A0A0A", fontSize: 30 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontFamily: "Outfit", fontWeight: 800 }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Join the GymPro community
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
              label="Full Name"
              value={formData.name}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              label="Phone"
              value={formData.phone}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
            <TextField
              fullWidth
              select
              label="Role"
              value={formData.role}
              sx={{ mb: 3 }}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="trainer">Trainer</MenuItem>
            </TextField>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              OR
            </Typography>
          </Divider>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#94A3B8" }}
          >
            Already have an account?{" "}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{ color: "#39FF14", textDecoration: "none", fontWeight: 600 }}
            >
              Sign In
            </Typography>
          </Typography>
        </Card>
      </motion.div>
    </Box>
  );
};

export default RegisterPage;
