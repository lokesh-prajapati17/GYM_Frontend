import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Star,
  Store as BranchIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { membershipService } from "../../membership/services/membershipService";
import { branchService } from "../../branches/services/branchService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  PageLoader,
  EmptyState,
  DeleteConfirmModal,
  FilterBar,
} from "../../../components/common";

// Lazy load form modal
const MembershipFormModal = lazy(
  () => import("../components/MembershipFormModal"),
);

const durationLabels = {
  1: "1 Month",
  3: "3 Months",
  6: "6 Months",
  12: "1 Year",
};

const INITIAL_FORM = {
  name: "",
  duration: 1,
  price: "",
  features: "",
  description: "",
  branch: "",
};

const MembershipsPage = () => {
  const theme = useTheme();

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // META DATA
  const [branches, setBranches] = useState([]);

  // FILTER (useRef)
  const filterRef = useRef({ search: "", branchId: "" });

  // CURRENT ITEM (useRef)
  const currentItem = useRef({});

  // MODAL MANAGEMENT
  const [modalType, setModalType] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner";
  const userBranchId = !isOwner
    ? user?.defaultBranchId || user?.branchAccess?.[0]
    : null;

  // Plan accent colors
  const planColors = [
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    "#A855F7",
  ];

  // API FETCHING
  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await membershipService.getAll();
      if (result?.data?.data) {
        setData(result.data.data);
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

  const fetchBranches = async () => {
    try {
      const res = await branchService.getBranches();
      setBranches(res.data || []);
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
      branch: isOwner ? "" : userBranchId || "",
    });
    setModalType("add");
  };

  const openEdit = (pkg) => {
    currentItem.current = pkg;
    setFormData({
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
      features: pkg.features?.join(", ") || "",
      description: pkg.description || "",
      branch: pkg.branch?._id || pkg.branch || "",
    });
    setModalType("edit");
  };

  const openDelete = (pkg) => {
    currentItem.current = pkg;
    setModalType("delete");
  };

  const executeDelete = async () => {
    if (!currentItem.current?._id) return;
    try {
      setIsDeleting(true);
      await membershipService.delete(currentItem.current._id);
      toast.success("Package deleted");
      setModalType("");
      getData();
    } catch (error) {
      toast.error("Failed to delete package");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };
      if (!isOwner && userBranchId) payload.branch = userBranchId;
      if (!payload.branch) delete payload.branch;

      if (modalType === "edit" && currentItem.current?._id) {
        await membershipService.update(currentItem.current._id, payload);
        toast.success("Package updated");
      } else {
        await membershipService.create(payload);
        toast.success("Package created");
      }
      setModalType("");
      getData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // UI HELPERS
  const getBranchName = (branchId) => {
    if (!branchId) return null;
    const id = branchId?._id || branchId;
    return branches.find((b) => b._id === id)?.name || null;
  };

  // CLIENT-SIDE FILTERING
  const filteredData = data.filter((pkg) => {
    const branchFilter = filterRef.current.branchId;
    if (branchFilter) {
      const pkgBranchId = pkg.branch?._id || pkg.branch;
      if (pkgBranchId !== branchFilter) return false;
    }
    const searchTerm = filterRef.current.search?.toLowerCase();
    if (searchTerm) {
      return pkg.name?.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  const showBranchFilter = isOwner && branches.length > 1;

  const filterConfig = showBranchFilter
    ? [
        {
          key: "branchId",
          label: "Filter by Branch",
          defaultValue: "",
          icon: BranchIcon,
          onChange: (val) => {
            filterRef.current.branchId = val;
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
            Membership Plans
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {isOwner
              ? "Manage gym membership packages across branches"
              : "Manage membership packages"}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
          Add Plan
        </Button>
      </Box>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search plans..."
        onSearchChange={(val) => {
          filterRef.current.search = val;
          setData([...data]);
        }}
        filters={filterConfig}
      />

      {/* Plan Cards */}
      {isLoading ? (
        <PageLoader />
      ) : filteredData.length > 0 ? (
        <Grid container spacing={3}>
          {filteredData.map((pkg, i) => (
            <Grid item xs={12} sm={6} md={3} key={pkg._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    border:
                      i === 2
                        ? `2px solid ${alpha(planColors[i % 4], 0.4)}`
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
                        bgcolor: alpha(planColors[i % 4], 0.15),
                        color: planColors[i % 4],
                        fontWeight: 700,
                        fontSize: "0.65rem",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {pkg.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {durationLabels[pkg.duration]}
                    </Typography>

                    {isOwner && getBranchName(pkg.branch) && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<BranchIcon sx={{ fontSize: 12 }} />}
                          label={getBranchName(pkg.branch)}
                          size="small"
                          sx={{
                            bgcolor: alpha("#A855F7", 0.1),
                            color: "#A855F7",
                            fontWeight: 600,
                            fontSize: "0.65rem",
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ my: 2 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: planColors[i % 4],
                        }}
                      >
                        ₹{pkg.price?.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        / {durationLabels[pkg.duration]}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 2,
                        fontSize: "0.8rem",
                      }}
                    >
                      {pkg.description}
                    </Typography>

                    <List dense sx={{ "& .MuiListItem-root": { px: 0 } }}>
                      {pkg.features?.map((f, fi) => (
                        <ListItem key={fi}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircle
                              sx={{
                                color: planColors[i % 4],
                                fontSize: 16,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={f}
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              color: theme.palette.text.secondary,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => openEdit(pkg)}
                        sx={{ color: theme.palette.warning.main }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => openDelete(pkg)}
                        sx={{ color: theme.palette.error.main }}
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
      ) : (
        <Card>
          <EmptyState
            message={
              filterRef.current.branchId
                ? "No plans found for this branch"
                : "No membership plans found. Create your first plan!"
            }
          />
        </Card>
      )}

      {/* Lazy Loaded Form Modal */}
      <Suspense fallback={null}>
        {(modalType === "add" || modalType === "edit") && (
          <MembershipFormModal
            open={true}
            type={modalType}
            formData={formData}
            branches={branches}
            isOwner={isOwner}
            userBranchId={userBranchId}
            onChange={handleChange}
            onSave={handleSave}
            onClose={() => setModalType("")}
          />
        )}
      </Suspense>

      {/* Delete Confirmation  */}
      <DeleteConfirmModal
        open={modalType === "delete"}
        title="Delete Package?"
        description={`Are you sure you want to delete "${currentItem.current?.name || "this package"}"? This cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onClose={() => setModalType("")}
      />
    </Box>
  );
};

export default MembershipsPage;
