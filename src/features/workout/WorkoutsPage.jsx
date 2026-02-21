import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  alpha,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  Add,
  Delete,
  Download,
  FitnessCenter,
  Restaurant,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { workoutService } from "../../services/services";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const WorkoutsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    title: "",
    description: "",
    type: "workout",
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await workoutService.getAll();
      setPlans(res.data.data);
    } catch {
      setPlans([
        {
          _id: "1",
          title: "Upper Body Blast",
          type: "workout",
          trainerId: { name: "Rahul Sharma" },
          memberId: { name: "Amit Kumar" },
          exercises: [
            { name: "Bench Press", sets: 4, reps: 12 },
            { name: "Shoulder Press", sets: 3, reps: 10 },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          title: "Keto Diet Plan",
          type: "diet",
          trainerId: { name: "Priya Singh" },
          memberId: { name: "Sneha Patel" },
          exercises: [],
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          title: "Leg Day Routine",
          type: "workout",
          trainerId: { name: "Rahul Sharma" },
          memberId: { name: "Vikram Reddy" },
          exercises: [
            { name: "Squats", sets: 5, reps: 8 },
            { name: "Leg Press", sets: 4, reps: 12 },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async () => {
    try {
      await workoutService.create(formData);
      toast.success("Plan created");
      setDialogOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this plan?")) {
      try {
        await workoutService.delete(id);
        toast.success("Deleted");
        fetchPlans();
      } catch {
        toast.error("Failed");
      }
    }
  };

  const canEdit = user?.role === "admin" || user?.role === "trainer";

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
            sx={{ fontWeight: 800, fontFamily: "Outfit" }}
          >
            Workout & Diet Plans
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Manage exercise and nutrition plans
          </Typography>
        </Box>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Create Plan
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {loading
          ? [1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))
          : plans.map((plan, i) => (
              <Grid item xs={12} md={4} key={plan._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background:
                          plan.type === "workout" ? "#39FF14" : "#FF6B35",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {plan.type === "workout" ? (
                        <FitnessCenter sx={{ color: "#39FF14" }} />
                      ) : (
                        <Restaurant sx={{ color: "#FF6B35" }} />
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {plan.title}
                      </Typography>
                    </Box>
                    <Chip
                      label={plan.type.toUpperCase()}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor: alpha(
                          plan.type === "workout" ? "#39FF14" : "#FF6B35",
                          0.1,
                        ),
                        color: plan.type === "workout" ? "#39FF14" : "#FF6B35",
                        fontWeight: 600,
                        fontSize: "0.65rem",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#94A3B8", mb: 1 }}
                    >
                      <strong>Trainer:</strong> {plan.trainerId?.name || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#94A3B8", mb: 2 }}
                    >
                      <strong>Member:</strong> {plan.memberId?.name || "-"}
                    </Typography>
                    {plan.exercises?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        {plan.exercises.slice(0, 3).map((ex, ei) => (
                          <Typography
                            key={ei}
                            variant="caption"
                            sx={{ display: "block", color: "#64748B", py: 0.3 }}
                          >
                            • {ex.name} — {ex.sets}×{ex.reps}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {canEdit && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(plan._id)}
                        sx={{ color: "#FF3131" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Card>
                </motion.div>
              </Grid>
            ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Member ID"
                value={formData.memberId}
                onChange={(e) =>
                  setFormData({ ...formData, memberId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="workout">Workout</MenuItem>
                <MenuItem value="diet">Diet</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: "#94A3B8" }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutsPage;
