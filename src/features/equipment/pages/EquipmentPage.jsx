import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Box, Typography, Button, Chip, IconButton } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { equipmentService } from "../services/equipmentService";
import {
  CommonCard,
  CommonTable,
  DeleteConfirmModal,
} from "../../../components/common";

// Lazy load form modal
const EquipmentFormModal = lazy(
  () => import("../components/EquipmentFormModal"),
);

const INITIAL_FORM = {
  name: "",
  category: "machines",
  status: "active",
  lastMaintenanceDate: "",
  nextMaintenanceDate: "",
  notes: "",
};

const EquipmentPage = () => {
  const theme = useTheme();

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // CURRENT ITEM (useRef)
  const currentItem = useRef({});

  // MODAL MANAGEMENT
  const [modalType, setModalType] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { user } = useSelector((state) => state.auth);
  const canEdit = user.role === "owner" || user.role === "admin";

  // API FETCHING
  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await equipmentService.getEquipment();
      if (result?.data) {
        setData(result.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load equipment");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // MODAL HANDLERS
  const openAdd = () => {
    currentItem.current = null;
    setFormData(INITIAL_FORM);
    setModalType("add");
  };

  const openEdit = (item) => {
    currentItem.current = item;
    setFormData({
      name: item.name,
      category: item.category,
      status: item.status,
      lastMaintenanceDate: item.lastMaintenanceDate
        ? new Date(item.lastMaintenanceDate).toISOString().split("T")[0]
        : "",
      nextMaintenanceDate: item.nextMaintenanceDate
        ? new Date(item.nextMaintenanceDate).toISOString().split("T")[0]
        : "",
      notes: item.notes || "",
    });
    setModalType("edit");
  };

  const openDelete = (item) => {
    currentItem.current = item;
    setModalType("delete");
  };

  const executeDelete = async () => {
    if (!currentItem.current?._id) return;
    try {
      setIsDeleting(true);
      await equipmentService.deleteEquipment(currentItem.current._id);
      toast.success("Equipment deleted successfully");
      setModalType("");
      getData();
    } catch (error) {
      toast.error("Failed to delete equipment");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      if (modalType === "edit" && currentItem.current?._id) {
        await equipmentService.updateEquipment(
          currentItem.current._id,
          formData,
        );
        toast.success("Equipment updated successfully");
      } else {
        await equipmentService.addEquipment(formData);
        toast.success("Equipment added successfully");
      }
      setModalType("");
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // STATUS HELPER
  const statusColors = {
    active: theme.palette.success.main,
    maintenance: theme.palette.warning.main,
    retired: theme.palette.error.main,
  };

  // TABLE COLUMNS
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {item.name}
        </Typography>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item) => (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textTransform: "capitalize",
          }}
        >
          {item.category?.replace("_", " ")}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Chip
          label={item.status?.toUpperCase()}
          size="small"
          sx={{
            bgcolor: alpha(
              statusColors[item.status] || theme.palette.text.secondary,
              0.15,
            ),
            color: statusColors[item.status] || theme.palette.text.secondary,
            fontWeight: 700,
            fontSize: "0.7rem",
          }}
        />
      ),
    },
    {
      key: "nextMaintenanceDate",
      label: "Next Maintenance",
      render: (item) => (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {item.nextMaintenanceDate
            ? new Date(item.nextMaintenanceDate).toLocaleDateString()
            : "Not Scheduled"}
        </Typography>
      ),
    },
    ...(canEdit
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
                <IconButton
                  onClick={() => openDelete(item)}
                  sx={{ color: theme.palette.error.main }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            ),
          },
        ]
      : []),
  ];

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
            <BuildIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: 32,
                mr: 1.5,
                verticalAlign: "middle",
              }}
            />
            Equipment & Maintenance
          </Typography>
        </Box>
        {canEdit && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            Add Equipment
          </Button>
        )}
      </Box>

      {/* Equipment Table */}
      <CommonCard>
        <CommonTable
          columns={columns}
          data={data}
          loading={isLoading}
          emptyMessage="No equipment records found."
          emptyIcon={BuildIcon}
        />
      </CommonCard>

      {/* Lazy Loaded Form Modal */}
      <Suspense fallback={null}>
        {(modalType === "add" || modalType === "edit") && (
          <EquipmentFormModal
            open={true}
            type={modalType}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={() => setModalType("")}
          />
        )}
      </Suspense>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={modalType === "delete"}
        title="Delete Equipment?"
        description={`Are you sure you want to delete "${currentItem.current?.name || "this equipment"}"? This cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onClose={() => setModalType("")}
      />
    </Box>
  );
};

export default EquipmentPage;
