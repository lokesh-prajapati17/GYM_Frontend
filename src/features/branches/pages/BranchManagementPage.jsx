import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Grid,
  Card,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  Star as StarIcon,
  ViewInAr as VrIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { branchService } from "../services/branchService";
import {
  CommonCard,
  CommonTable,
  FilterBar,
  DeleteConfirmModal,
  PageLoader,
} from "../../../components/common";

// Lazy load form modal
const BranchFormModal = lazy(() => import("../components/BranchFormModal"));

const INITIAL_FORM = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  floorCount: 1,
  vrEnabled: false,
  isActive: true,
};

const BranchManagementPage = () => {
  const theme = useTheme();

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // PAGINATION (state for UI re-render)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FORM STATE
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // FILTER & PAGINATION (useRef)
  const filterRef = useRef({ page: 1, limit: 10, search: "" });

  // CURRENT ITEM (useRef)
  const currentItem = useRef({});

  // MODAL MANAGEMENT ("" | "add" | "edit" | "delete")
  const [modalType, setModalType] = useState("");

  const { user } = useSelector((state) => state.auth);

  // API FETCHING
  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await branchService.getBranches(filterRef.current);
      if (result?.success || result?.data) {
        setData(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.pages || 1);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load branches");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // FILTER HANDLERS
  const handleSearch = (value) => {
    filterRef.current.search = value;
    filterRef.current.page = 1;
    setCurrentPage(1);
    getData();
  };

  const handlePageChange = (page) => {
    filterRef.current.page = page;
    setCurrentPage(page);
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  // MODAL HANDLERS
  const openAdd = () => {
    currentItem.current = null;
    setFormData(INITIAL_FORM);
    setLogoFile(null);
    setLogoPreview(null);
    setModalType("add");
  };

  const openEdit = (branch) => {
    currentItem.current = branch;
    setFormData({
      name: branch.name || "",
      phone: branch.phone || "",
      street: branch.address?.street || "",
      city: branch.address?.city || "",
      state: branch.address?.state || "",
      pincode: branch.address?.pincode || "",
      floorCount: branch.floorCount || 1,
      vrEnabled: branch.vrEnabled || false,
      isActive: branch.isActive !== false,
    });
    setLogoPreview(branch.branchLogo || null);
    setLogoFile(null);
    setModalType("edit");
  };

  const openDelete = (branch) => {
    currentItem.current = branch;
    setModalType("delete");
  };

  const executeDelete = async () => {
    if (!currentItem.current?._id) return;
    try {
      setIsDeleting(true);
      await branchService.deleteBranch(currentItem.current._id);
      toast.success("Branch deleted successfully");
      setModalType("");
      getData();
    } catch (error) {
      toast.error("Failed to delete branch");
    } finally {
      setIsDeleting(false);
    }
  };

  // UI HELPERS
  const formatAddress = (addr) => {
    if (!addr) return "N/A";
    const parts = [addr.street, addr.city, addr.state, addr.pincode].filter(
      Boolean,
    );
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  // TABLE COLUMNS
  const columns = [
    {
      key: "name",
      label: "Branch Name",
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {item.branchLogo ? (
            <Avatar src={item.branchLogo} sx={{ width: 28, height: 28 }} />
          ) : (
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                fontSize: "0.75rem",
              }}
            >
              {item.name?.charAt(0)}
            </Avatar>
          )}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {item.name}
          </Typography>
          {item.isMainBranch && (
            <Tooltip title="Main Branch">
              <StarIcon
                sx={{ color: theme.palette.warning.main, fontSize: 16 }}
              />
            </Tooltip>
          )}
          {item.vrEnabled && (
            <Tooltip title="VR Enabled">
              <VrIcon sx={{ color: theme.palette.info.main, fontSize: 16 }} />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (item) => (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {formatAddress(item.address)}
        </Typography>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (item) => (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {item.phone || "N/A"}
        </Typography>
      ),
    },
    {
      key: "floorCount",
      label: "Floors",
      render: (item) => (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {item.floorCount || 1}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Chip
          label={item.isActive !== false ? "ACTIVE" : "INACTIVE"}
          size="small"
          sx={{
            bgcolor: alpha(
              item.isActive !== false
                ? theme.palette.success.main
                : theme.palette.error.main,
              0.15,
            ),
            color:
              item.isActive !== false
                ? theme.palette.success.main
                : theme.palette.error.main,
            fontWeight: 700,
            fontSize: "0.7rem",
          }}
        />
      ),
    },
    ...(user.role === "owner"
      ? [
          {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (item) => (
              <>
                <IconButton
                  onClick={() => openEdit(item)}
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                {!item.isMainBranch && (
                  <IconButton
                    onClick={() => openDelete(item)}
                    sx={{ color: theme.palette.error.main }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </>
            ),
          },
        ]
      : []),
  ];

  // STATS CARDS
  const stats = [
    {
      label: "Total Branches",
      value: data.length,
      color: theme.palette.text.primary,
    },
    {
      label: "Active Branches",
      value: data.filter((b) => b.isActive !== false).length,
      color: theme.palette.success.main,
    },
    {
      label: "VR Enabled",
      value: data.filter((b) => b.vrEnabled).length,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box sx={{ position: "relative" }}>
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
            <StoreIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: 32,
                mr: 1.5,
                verticalAlign: "middle",
              }}
            />
            Branch Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
          >
            Manage your gym branches and locations
          </Typography>
        </Box>
        {user.role === "owner" && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            Add Branch
          </Button>
        )}
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.04em",
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h3"
                sx={{ color: stat.color, fontWeight: 700, mt: 1 }}
              >
                {stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search / Filters */}
      <FilterBar
        searchPlaceholder="Search branches..."
        onSearchChange={handleSearch}
      />

      {/* Branch Table */}
      <CommonCard>
        <CommonTable
          columns={columns}
          data={data}
          loading={isLoading}
          emptyMessage="No branches found."
          emptyIcon={StoreIcon}
          pagination={{ page: currentPage, pages: totalPages }}
          onPageChange={handlePageChange}
        />
      </CommonCard>

      {/* Lazy Loaded Modals */}
      <Suspense fallback={null}>
        <BranchFormModal
          open={modalType === "add" || modalType === "edit"}
          type={modalType}
          currentItem={currentItem}
          formData={formData}
          setFormData={setFormData}
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
          setLogoFile={setLogoFile}
          primaryColor={theme.palette.primary.main}
          onClose={() => setModalType("")}
          onRefresh={getData}
        />
      </Suspense>

      <DeleteConfirmModal
        open={modalType === "delete"}
        title="Delete Branch?"
        description={`Are you sure you want to delete "${currentItem.current?.name || "this branch"}"? This cannot be undone and may affect members attached to this branch.`}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onClose={() => setModalType("")}
      />
    </Box>
  );
};

export default BranchManagementPage;
