import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  alpha,
  Tooltip,
  Pagination,
  Skeleton,
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
  PersonAdd,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { memberService } from "../services/memberService";
import { membershipService } from "../../membership/services/membershipService";
import { dashboardService } from "../../dashboard/services/dashboardService";
import toast from "react-hot-toast";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [packages, setPackages] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    height: "",
    weight: "",
    dateOfBirth: "",
    gender: "",
    membershipPlan: "",
    trainerId: "",
    address: "",
    emergencyContact: "",
    bloodGroup: "",
    goals: "",
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await memberService.getAll({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      setMembers(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch {
      setMembers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [pkgRes, trainerRes] = await Promise.all([
        membershipService.getAll(),
        dashboardService.getTrainers(),
      ]);
      setPackages(pkgRes.data.data);
      setTrainers(trainerRes.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchMembers();
  }, [page, search, statusFilter]);
  useEffect(() => {
    fetchMeta();
  }, []);

  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditing(member);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone || "",
        height: member.profile?.height || "",
        weight: member.profile?.weight || "",
        dateOfBirth: member.profile?.dateOfBirth
          ? member.profile.dateOfBirth.slice(0, 10)
          : "",
        gender: member.profile?.gender || "",
        membershipPlan: member.profile?.membershipPlan?._id || "",
        trainerId: member.profile?.trainerId?._id || "",
        address: member.profile?.address || "",
        emergencyContact: member.profile?.emergencyContact || "",
        bloodGroup: member.profile?.bloodGroup || "",
        goals: member.profile?.goals || "",
        password: "",
      });
    } else {
      setEditing(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "Member@123",
        height: "",
        weight: "",
        dateOfBirth: "",
        gender: "",
        membershipPlan: "",
        trainerId: "",
        address: "",
        emergencyContact: "",
        bloodGroup: "",
        goals: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await memberService.update(editing._id, formData);
        toast.success("Member updated successfully");
      } else {
        await memberService.create(formData);
        toast.success("Member added successfully");
      }
      setDialogOpen(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await memberService.delete(id);
        toast.success("Member deleted");
        fetchMembers();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const statusColors = {
    active: "#39FF14",
    expired: "#FF3131",
    frozen: "#FFB800",
    cancelled: "#94A3B8",
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: "Outfit" }}
          >
            Members
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Manage gym members
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpenDialog()}
          sx={{ px: 3 }}
        >
          Add Member
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search members..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="frozen">Frozen</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>BMI</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : members.length > 0 ? (
                <AnimatePresence>
                  {members.map((m, index) => (
                    <motion.tr
                      key={m._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ display: "table-row" }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha("#39FF14", 0.15),
                              color: "#39FF14",
                              width: 36,
                              height: 36,
                              fontSize: "0.875rem",
                            }}
                          >
                            {m.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {m.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#94A3B8" }}
                            >
                              {m.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {m.phone || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={m.profile?.membershipPlan?.name || "None"}
                          size="small"
                          sx={{
                            bgcolor: alpha("#00F5FF", 0.08),
                            color: "#00F5FF",
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {m.profile?.trainerId?.name || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={m.profile?.status || "N/A"}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              statusColors[m.profile?.status] || "#94A3B8",
                              0.1,
                            ),
                            color: statusColors[m.profile?.status] || "#94A3B8",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              m.profile?.bmiCategory === "Normal"
                                ? "#39FF14"
                                : m.profile?.bmiCategory === "Overweight"
                                  ? "#FFB800"
                                  : "#FF3131",
                            fontWeight: 600,
                          }}
                        >
                          {m.profile?.bmi || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/members/${m._id}`)}
                            sx={{ color: "#00F5FF" }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(m)}
                            sx={{ color: "#FFB800" }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(m._id)}
                            sx={{ color: "#FF3131" }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="h6" sx={{ color: "#64748B" }}>
                      No members found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              sx={{
                "& .MuiPaginationItem-root": { color: "#94A3B8" },
                "& .Mui-selected": {
                  bgcolor: alpha("#39FF14", 0.15) + " !important",
                  color: "#39FF14",
                },
              }}
            />
          </Box>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editing ? "Edit Member" : "Add New Member"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Grid>
            {!editing && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Membership Plan"
                value={formData.membershipPlan}
                onChange={(e) =>
                  setFormData({ ...formData, membershipPlan: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {packages.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.name} - ₹{p.price}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Assign Trainer"
                value={formData.trainerId}
                onChange={(e) =>
                  setFormData({ ...formData, trainerId: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {trainers?.map((t) => (
                  <MenuItem key={t._id} value={t._id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fitness Goals"
                multiline
                rows={2}
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
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
            {editing ? "Update" : "Add Member"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembersPage;
