import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Avatar,
  Chip,
  alpha,
  Skeleton,
} from "@mui/material";
import { People, SportsMartialArts } from "@mui/icons-material";
import { motion } from "framer-motion";
import { dashboardService } from "../dashboard/services/dashboardService";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getTrainers();
        setTrainers(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setFormData({ name: "", email: "", phone: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await dashboardService.createTrainer(formData);
      setTrainers((prev) => [res.data.data, ...prev]);
      handleClose();
    } catch (error) {
      console.error("Failed to create trainer:", error);
      alert(error.response?.data?.message || "Failed to create trainer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 0.5 }}
          >
            Trainers
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            View and manage trainers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            bgcolor: "#39FF14",
            color: "#000",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: alpha("#39FF14", 0.8) },
          }}
        >
          Add Trainer
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? [1, 2].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))
          : trainers?.map((t, i) => (
              <Grid item xs={12} sm={6} md={4} key={t._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card sx={{ p: 3, textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 72,
                        height: 72,
                        mx: "auto",
                        mb: 2,
                        fontSize: "1.5rem",
                        bgcolor: alpha("#00F5FF", 0.15),
                        color: "#00F5FF",
                        fontWeight: 700,
                      }}
                    >
                      {t.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#94A3B8", mb: 1 }}
                    >
                      {t.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#94A3B8", mb: 2 }}
                    >
                      {t.phone}
                    </Typography>
                    <Chip
                      label={`${t.assignedMembersCount} Members Assigned`}
                      icon={<People sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: alpha("#39FF14", 0.1),
                        color: "#39FF14",
                        fontWeight: 600,
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
      </Grid>

      {/* Add Trainer Modal */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            Add New Trainer
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "#94A3B8" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  helperText="Password must be at least 6 characters"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              sx={{ color: "#94A3B8" }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? (
                <CircularProgress size={24} sx={{ color: "#000" }} />
              ) : (
                "Add Trainer"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TrainersPage;
