import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Card,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  People,
  Add as AddIcon,
  Store as BranchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { trainerService } from "./services/trainerService";
import { branchService } from "../branches/services/branchService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  PageLoader,
  EmptyState,
  DeleteConfirmModal,
  FilterBar,
} from "../../components/common";

// Lazy load trainer form modal
const TrainerFormModal = lazy(() => import("./components/TrainerFormModal"));

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  branchId: "",
};

const TrainersPage = () => {
  const theme = useTheme();

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // META DATA
  const [branches, setBranches] = useState([]);

  // FILTER (useRef)
  const filterRef = useRef({
    page: 1,
    limit: 10,
    search: "",
    branchId: "",
  });

  // CURRENT ITEM (useRef)
  const currentItem = useRef({});

  // MODAL MANAGEMENT ("" | "add" | "edit" | "delete")
  const [modalType, setModalType] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner" || user?.role === "admin";
  const userBranchId = !isOwner
    ? user?.defaultBranchId || user?.branchAccess?.[0]
    : null;

  // API FETCHING
  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await trainerService.getAll();
      if (res?.data?.data) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to load trainers:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await branchService.getBranches();
      const allBranches = res.data || [];
      setBranches(allBranches);

      if (!isOwner && userBranchId) {
        filterRef.current.branchId = userBranchId;
      }
    } catch (error) {
      console.error("Failed to load branches:", error);
    }
  };

  useEffect(() => {
    getData();
    fetchBranches();
  }, []);

  // MODAL HANDLERS
  const openAdd = () => {
    currentItem.current = null;
    setFormData({
      ...INITIAL_FORM,
      branchId: isOwner ? "" : userBranchId || "",
    });
    setModalType("add");
  };

  const openEdit = (trainer) => {
    currentItem.current = trainer;
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone || "",
      password: "",
      branchId: trainer.branchAccess?.[0] || trainer.defaultBranchId || "",
    });
    setModalType("edit");
  };

  const openDelete = (trainer) => {
    currentItem.current = trainer;
    setModalType("delete");
  };

  const executeDelete = async () => {
    if (!currentItem.current?._id) return;
    try {
      setIsDeleting(true);
      await trainerService.delete(currentItem.current._id);
      toast.success("Trainer deleted");
      setModalType("");
      getData();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchId) {
      toast.error("Please select a branch for the trainer");
      return;
    }

    try {
      const payload = { ...formData };
      if (modalType === "edit" && currentItem.current?._id) {
        delete payload.password;
        await trainerService.update(currentItem.current._id, payload);
        toast.success("Trainer updated successfully");
      } else {
        await trainerService.create(payload);
        toast.success("Trainer added successfully");
      }
      setModalType("");
      getData();
    } catch (error) {
      console.error("Failed to save trainer:", error);
      toast.error(error.response?.data?.message || "Failed to save trainer");
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // UI HELPERS
  const getBranchName = (branchIds) => {
    if (!branchIds || branchIds.length === 0) return "Unassigned";
    const branch = branches.find(
      (b) => b._id === branchIds[0] || b._id === branchIds[0]?._id,
    );
    return branch?.name || "Unknown";
  };

  // CLIENT-SIDE FILTERING (trainers API doesn't paginate server-side)
  const filteredData = data.filter((t) => {
    const branchFilter = filterRef.current.branchId;
    if (branchFilter) {
      const matchesBranch = t.branchAccess?.some(
        (bId) => bId === branchFilter || bId?._id === branchFilter,
      );
      if (!matchesBranch) return false;
    }
    const searchTerm = filterRef.current.search?.toLowerCase();
    if (searchTerm) {
      return (
        t.name?.toLowerCase().includes(searchTerm) ||
        t.email?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const showBranchFilter = isOwner && branches.length > 1;

  // FILTER CONFIG
  const filterConfig = showBranchFilter
    ? [
        {
          key: "branchId",
          label: "Filter by Branch",
          defaultValue: "",
          icon: BranchIcon,
          onChange: (val) => {
            filterRef.current.branchId = val;
            // Force re-render for client-side filter
            setData([...data]);
          },
          options: [
            { value: "", label: "All Branches" },
            ...branches.map((b) => ({
              value: b._id,
              label: b.name + (b.isMainBranch ? " ⭐" : ""),
            })),
          ],
        },
      ]
    : [];

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Trainers
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {isOwner
              ? "View and manage trainers across branches"
              : "View and manage trainers"}
          </Typography>
        </Box>
        {isOwner && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            Add Trainer
          </Button>
        )}
      </Box>

      {/* Filters */}
      {(showBranchFilter || true) && (
        <FilterBar
          searchPlaceholder="Search trainers..."
          onSearchChange={(val) => {
            filterRef.current.search = val;
            setData([...data]);
          }}
          filters={filterConfig}
        />
      )}

      {/* Trainer Cards Grid */}
      {isLoading ? (
        <PageLoader />
      ) : filteredData.length > 0 ? (
        <Grid container spacing={3}>
          {filteredData.map((t, i) => (
            <Grid item xs={12} sm={6} md={4} key={t._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card sx={{ p: 3, textAlign: "center", position: "relative" }}>
                  {/* Action Buttons */}
                  {isOwner && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => openEdit(t)}
                          sx={{ color: theme.palette.warning.main }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => openDelete(t)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}

                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      mx: "auto",
                      mb: 2,
                      fontSize: "1.5rem",
                      bgcolor: alpha(theme.palette.info.main, 0.15),
                      color: theme.palette.info.main,
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
                    sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
                  >
                    {t.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, mb: 1 }}
                  >
                    {t.phone || "-"}
                  </Typography>

                  {isOwner && (
                    <Chip
                      icon={<BranchIcon sx={{ fontSize: 14 }} />}
                      label={getBranchName(t.branchAccess)}
                      size="small"
                      sx={{
                        bgcolor: alpha("#A855F7", 0.1),
                        color: "#A855F7",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                  )}
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`${t.assignedMembersCount || 0} Members`}
                      icon={<People sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <EmptyState
            message={
              filterRef.current.branchId
                ? "No trainers found for this branch."
                : "No trainers found. Add your first trainer!"
            }
          />
        </Card>
      )}

      {/* Trainer Add/Edit Modal (inline since it's simple) */}
      <Suspense fallback={null}>
        {(modalType === "add" || modalType === "edit") && (
          <TrainerFormModal
            open={true}
            type={modalType}
            formData={formData}
            branches={branches}
            isOwner={isOwner}
            userBranchId={userBranchId}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={() => setModalType("")}
          />
        )}
      </Suspense>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={modalType === "delete"}
        title="Delete Trainer?"
        description={`Are you sure you want to completely remove ${currentItem.current?.name || "this trainer"}? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onClose={() => setModalType("")}
      />
    </Box>
  );
};

export default TrainersPage;
