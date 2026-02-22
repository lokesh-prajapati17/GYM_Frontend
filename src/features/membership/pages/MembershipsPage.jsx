import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  alpha,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { membershipService } from "../../membership/services/membershipService";
import toast from "react-hot-toast";

const durationLabels = {
  1: "1 Month",
  3: "3 Months",
  6: "6 Months",
  12: "1 Year",
};
const planColors = ["#39FF14", "#00F5FF", "#FF6B35", "#A855F7"];

const MembershipsPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: 1,
    price: "",
    features: "",
    description: "",
  });

  const fetchPackages = async () => {
    try {
      const res = await membershipService.getAll();
      setPackages(res.data.data);
    } catch {
      setPackages([
        {
          _id: "1",
          name: "Basic Monthly",
          duration: 1,
          price: 999,
          features: ["Gym access", "Basic equipment", "Locker room"],
          description: "Perfect for beginners",
          isActive: true,
        },
        {
          _id: "2",
          name: "Silver Quarterly",
          duration: 3,
          price: 2499,
          features: [
            "Full gym access",
            "All equipment",
            "Steam room",
            "1 PT session/week",
          ],
          description: "Great value",
          isActive: true,
        },
        {
          _id: "3",
          name: "Gold Half-Yearly",
          duration: 6,
          price: 4499,
          features: [
            "Full gym access",
            "All equipment",
            "Steam room",
            "Sauna",
            "2 PT sessions/week",
            "Diet plan",
          ],
          description: "Most popular",
          isActive: true,
        },
        {
          _id: "4",
          name: "Platinum Annual",
          duration: 12,
          price: 7999,
          features: [
            "Everything included",
            "Unlimited PT",
            "Pool",
            "Supplements discount",
          ],
          description: "Ultimate experience",
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };
      if (editing) {
        await membershipService.update(editing._id, data);
        toast.success("Package updated");
      } else {
        await membershipService.create(data);
        toast.success("Package created");
      }
      setDialogOpen(false);
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this package?")) {
      try {
        await membershipService.delete(id);
        toast.success("Package deleted");
        fetchPackages();
      } catch {
        toast.error("Failed");
      }
    }
  };

  const openDialog = (pkg = null) => {
    setEditing(pkg);
    setFormData(
      pkg
        ? {
            name: pkg.name,
            duration: pkg.duration,
            price: pkg.price,
            features: pkg.features?.join(", ") || "",
            description: pkg.description || "",
          }
        : { name: "", duration: 1, price: "", features: "", description: "" },
    );
    setDialogOpen(true);
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
            sx={{ fontWeight: 800, fontFamily: "Outfit" }}
          >
            Membership Plans
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Manage gym membership packages
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => openDialog()}
        >
          Add Plan
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton
                  variant="rounded"
                  height={350}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))
          : packages.map((pkg, i) => (
              <Grid item xs={12} sm={6} md={3} key={pkg._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      border:
                        i === 2
                          ? `2px solid ${alpha(planColors[i], 0.4)}`
                          : undefined,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: planColors[i % 4],
                      },
                    }}
                  >
                    {i === 2 && (
                      <Chip
                        label="POPULAR"
                        size="small"
                        icon={<Star sx={{ fontSize: 14 }} />}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: alpha(planColors[i], 0.15),
                          color: planColors[i],
                          fontWeight: 700,
                          fontSize: "0.65rem",
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {pkg.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                        {durationLabels[pkg.duration]}
                      </Typography>

                      <Box sx={{ my: 2 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            fontFamily: "Outfit",
                            color: planColors[i % 4],
                          }}
                        >
                          ₹{pkg.price?.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          / {durationLabels[pkg.duration]}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ color: "#94A3B8", mb: 2, fontSize: "0.8rem" }}
                      >
                        {pkg.description}
                      </Typography>

                      <List dense sx={{ "& .MuiListItem-root": { px: 0 } }}>
                        {pkg.features?.map((f, fi) => (
                          <ListItem key={fi}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckCircle
                                sx={{ color: planColors[i % 4], fontSize: 16 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={f}
                              primaryTypographyProps={{
                                fontSize: "0.8rem",
                                color: "#CBD5E1",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <IconButton
                          size="small"
                          onClick={() => openDialog(pkg)}
                          sx={{ color: "#FFB800" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(pkg._id)}
                          sx={{ color: "#FF3131" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
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
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editing ? "Edit" : "Add"} Package
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Package Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              >
                <MenuItem value={1}>1 Month</MenuItem>
                <MenuItem value={3}>3 Months</MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
                <MenuItem value={12}>1 Year</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Features (comma separated)"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={2}
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
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipsPage;
