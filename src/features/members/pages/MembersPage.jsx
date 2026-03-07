import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
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
  Grid,
  MenuItem,
  alpha,
  Tooltip,
  Pagination,
  Skeleton,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Visibility,
  PersonAdd,
  Store as BranchIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { memberService } from "../services/memberService";
import { membershipService } from "../../membership/services/membershipService";
import { dashboardService } from "../../dashboard/services/dashboardService";
import { branchService } from "../../branches/services/branchService";
import { useSelector } from "react-redux";
import PageLoader from "../../../components/common/PageLoader";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import EmptyState from "../../../components/common/EmptyState";

// PERFORMANCE & CLEAN CODE: Lazy load modals
const MemberFormModal = lazy(() => import("../components/MemberFormModal"));

const MembersPage = () => {
  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // META DATA STATES (Dropdowns)
  const [packages, setPackages] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [branches, setBranches] = useState([]);

  // FILTER & PAGINATION MANAGEMENT (useRef instead of state)
  const filterRef = useRef({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    branchId: "",
  });

  // Derived state to force re-render on page number change for the Pagination component UI only
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // CURRENT EDIT ITEM
  const currentItem = useRef({});

  // MODAL MANAGEMENT ("" | "add" | "edit" | "delete")
  const [modalType, setModalType] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner";
  const userBranchId = !isOwner
    ? user?.defaultBranchId || user?.branchAccess?.[0]
    : null;

  // API FETCHING PATTERN
  const getData = async () => {
    try {
      setIsLoading(true);

      const params = { ...filterRef.current };
      // Scope branch
      if (!isOwner && userBranchId) {
        params.branchId = userBranchId;
      }

      const result = await memberService.getAll(params);

      if (result?.data?.success || result?.data) {
        // API either returns data directly, or wrapped in success
        const membersList = result.data.data || result.data;
        setData(membersList || []);

        // Handle standardized pagination format
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.pages);
        } else if (result.data.pages) {
          setTotalPages(result.data.pages);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrainer = async () => {
    try {
      const trainerRes = await dashboardService.getTrainers();
      console.log(trainerRes, "trainerRes");
      if (trainerRes?.data?.success || trainerRes?.data) {
        setTrainers(trainerRes?.data?.data || trainerRes?.data || []);
      }
    } catch (error) {
      console.error("Failed fetching trainers", error);
    }
  };

  const getPackages = async () => {
    try {
      const pkgRes = await membershipService.getAll();
      if (pkgRes?.data?.success || pkgRes?.data) {
        setPackages(pkgRes?.data?.data || pkgRes?.data || []);
      }
    } catch (error) {
      console.error("Failed fetching packages", error);
    }
  };

  const getBranches = async () => {
    try {
      const branchRes = await branchService.getBranches();
      if (branchRes?.data?.success || branchRes?.data) {
        setBranches(branchRes?.data?.data || branchRes?.data || []);
      }
    } catch (error) {
      console.error("Failed fetching branches", error);
    }
  };

  useEffect(() => {
    getTrainer();
    getPackages();
    getBranches();
    getData();
  }, []);

  // Update Filters
  const handleSearch = (e) => {
    filterRef.current.search = e.target.value;
    filterRef.current.page = 1;
    setCurrentPage(1);
    getData();
  };

  const handleStatusFilter = (e) => {
    filterRef.current.status = e.target.value;
    filterRef.current.page = 1;
    setCurrentPage(1);
    getData();
  };

  const handleBranchFilter = (e) => {
    filterRef.current.branchId = e.target.value;
    filterRef.current.page = 1;
    setCurrentPage(1);
    getData();
  };

  const handlePageChange = (_, value) => {
    filterRef.current.page = value;
    setCurrentPage(value);
    getData();
  };

  // Open Modals
  const openAdd = () => {
    currentItem.current = null;
    setModalType("add");
  };

  const openEdit = (member) => {
    currentItem.current = member;
    setModalType("edit");
  };

  const openDelete = (member) => {
    currentItem.current = member;
    setModalType("delete");
  };

  const executeDelete = async () => {
    if (!currentItem?.current) return;
    try {
      setIsDeleting(true);
      await memberService.delete(currentItem.current._id);
      import("react-hot-toast").then((m) =>
        m.default.success("Member deleted completely"),
      );
      setModalType("");
      getData();
    } catch (err) {
      import("react-hot-toast").then((m) =>
        m.default.error("Failed to delete member"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // UI Helpers
  const getBranchName = (bId) => {
    if (!bId) return null;
    const id = bId?._id || bId;
    const b = branches.find((br) => br._id === id);
    return b?.name || null;
  };

  const statusColors = {
    active: "#39FF14",
    expired: "#FF3131",
    frozen: "#FFB800",
    cancelled: "#94A3B8",
  };

  const showBranchFilter = isOwner && branches.length > 1;

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
            {isOwner
              ? "Manage gym members across branches"
              : "Manage gym members"}
          </Typography>
        </Box>
        {(isOwner || user?.role === "admin") && (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={openAdd}
            sx={{ px: 3 }}
          >
            Add Member
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={showBranchFilter ? 4 : 6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search members..."
              defaultValue={filterRef.current.search}
              onChange={handleSearch}
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
              defaultValue={filterRef.current.status}
              onChange={handleStatusFilter}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="frozen">Frozen</MenuItem>
            </TextField>
          </Grid>
          {showBranchFilter && (
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Branch"
                defaultValue={filterRef.current.branchId}
                onChange={handleBranchFilter}
                InputProps={{
                  startAdornment: (
                    <BranchIcon
                      sx={{ color: "#94A3B8", mr: 1, fontSize: 18 }}
                    />
                  ),
                }}
              >
                <MenuItem value="">All Branches</MenuItem>
                {branches.map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.name}
                    {b.isMainBranch ? " ⭐" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
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
                {showBranchFilter && <TableCell>Branch</TableCell>}
                <TableCell>Plan</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>BMI</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={showBranchFilter ? 8 : 7} sx={{ p: 0 }}>
                    <PageLoader />
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                <AnimatePresence>
                  {data.map((m, index) => (
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
                      {showBranchFilter && (
                        <TableCell>
                          {getBranchName(m.profile?.branch) ? (
                            <Chip
                              label={getBranchName(m.profile?.branch)}
                              size="small"
                              sx={{
                                bgcolor: alpha("#A855F7", 0.08),
                                color: "#A855F7",
                                fontSize: "0.7rem",
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748B" }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                      )}
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
                            onClick={() => openEdit(m)}
                            sx={{ color: "#FFB800" }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => openDelete(m)}
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
                  <TableCell colSpan={showBranchFilter ? 8 : 7} sx={{ p: 0 }}>
                    <EmptyState message="No members found matching filters." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Only render pagination if totalPages > 1 */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
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

      {/* Lazy Loaded Modals */}
      <Suspense fallback={null}>
        <MemberFormModal
          open={modalType === "add" || modalType === "edit"}
          type={modalType}
          currentItem={currentItem}
          packages={packages}
          trainers={trainers}
          onClose={() => setModalType("")}
          onRefresh={getData}
        />
        <DeleteConfirmModal
          open={modalType === "delete"}
          title="Delete Member?"
          description={`Are you sure you want to completely remove ${currentItem.current?.name || "this member"}? This action cannot be undone.`}
          isDeleting={isDeleting}
          onConfirm={executeDelete}
          onClose={() => setModalType("")}
        />
      </Suspense>
    </Box>
  );
};

export default MembersPage;
