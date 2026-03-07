import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  IconButton,
  Chip,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload,
  Panorama,
  DragIndicator,
  Visibility,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { selectThemeColors } from "../../vr/vrThemeSlice";
import { floorService } from "../services/floorService";
import toast from "react-hot-toast";
import {
  PageLoader,
  EmptyState,
  DeleteConfirmModal,
} from "../../../components/common";

const FloorFormModal = lazy(() => import("../components/FloorFormModal"));

const INITIAL_FORM = {
  name: "",
  slug: "",
  order: 0,
  description: "",
};

const FloorManagement = () => {
  const colors = useSelector(selectThemeColors);

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // CURRENT ITEM
  const currentItem = useRef({});

  // MODAL MANAGEMENT
  const [modalType, setModalType] = useState("");

  // FORM + FILES STATE
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [panoramaFile, setPanoramaFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [panoramaPreview, setPanoramaPreview] = useState(null);
  const [previewPreview, setPreviewPreview] = useState(null);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await floorService.getAll();
      if (res?.data?.data) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const openAdd = () => {
    currentItem.current = null;
    setFormData({ ...INITIAL_FORM, order: data.length });
    setPanoramaFile(null);
    setPreviewFile(null);
    setPanoramaPreview(null);
    setPreviewPreview(null);
    setModalType("add");
  };

  const openEdit = (floor) => {
    currentItem.current = floor;
    setFormData({
      name: floor.name,
      slug: floor.slug,
      order: floor.order,
      description: floor.description || "",
    });
    setPanoramaPreview(floor.panoramaImage || null);
    setPreviewPreview(floor.previewImage || null);
    setPanoramaFile(null);
    setPreviewFile(null);
    setModalType("edit");
  };

  const openDelete = (floor) => {
    currentItem.current = floor;
    setModalType("delete");
  };

  const handleFileChange = (e, type) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    // Validate
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "panorama") {
      setPanoramaFile(file);
      setPanoramaPreview(previewUrl);
    } else {
      setPreviewFile(file);
      setPreviewPreview(previewUrl);
    }
  };

  // Auto-generate slug from name if adding
  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "name" && modalType === "add") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 50);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }
    if (modalType === "add" && !panoramaFile) {
      toast.error("Panorama image is required for new floors");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("slug", formData.slug);
      fd.append("order", formData.order);
      fd.append("description", formData.description);

      if (panoramaFile) fd.append("panoramaImage", panoramaFile);
      if (previewFile) fd.append("previewImage", previewFile);

      if (modalType === "edit" && currentItem.current?._id) {
        await floorService.update(currentItem.current._id, fd);
        toast.success("Floor updated successfully");
      } else {
        await floorService.create(fd);
        toast.success("Floor created successfully");
      }

      setModalType("");
      getData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const executeDelete = async () => {
    if (!currentItem.current?._id) return;
    try {
      setIsDeleting(true);
      await floorService.delete(currentItem.current._id);
      toast.success("Floor deleted");
      setModalType("");
      getData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Floor Management
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Upload 360° panoramas and manage gym floors for the VR experience
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            bgcolor: colors.primary,
            color: "#0A0A0A",
            "&:hover": { bgcolor: alpha(colors.primary, 0.85) },
          }}
        >
          Add Floor
        </Button>
      </Box>

      {/* Floor Grid */}
      {isLoading ? (
        <PageLoader />
      ) : data.length > 0 ? (
        <Grid container spacing={3}>
          <AnimatePresence>
            {data.map((floor, i) => (
              <Grid item xs={12} sm={6} md={4} key={floor._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card
                    sx={{
                      overflow: "hidden",
                      border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: colors.primary,
                        zIndex: 1,
                      },
                    }}
                  >
                    {/* Panorama Preview */}
                    <Box
                      sx={{
                        height: 160,
                        bgcolor: alpha(colors.primary, 0.03),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {floor.panoramaImage ? (
                        <img
                          src={floor.panoramaImage}
                          alt={floor.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <Panorama
                          sx={{
                            fontSize: 48,
                            color: alpha(colors.primary, 0.2),
                          }}
                        />
                      )}
                    </Box>

                    {/* Info */}
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <DragIndicator
                          sx={{ color: "text.secondary", fontSize: 16 }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, flex: 1, fontSize: "1rem" }}
                        >
                          {floor.name}
                        </Typography>
                        <Chip
                          label={`#${floor.order || 0}`}
                          size="small"
                          sx={{
                            bgcolor: alpha(colors.primary, 0.1),
                            color: colors.primary,
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.8rem",
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: 40,
                        }}
                      >
                        {floor.description || "No description"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label={`${floor.hotspots?.length || 0} hotspots`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.65rem", borderColor: "divider" }}
                        />
                        <Chip
                          label={floor.slug}
                          size="small"
                          sx={{
                            bgcolor: alpha("text.secondary", 0.08),
                            color: "text.secondary",
                            fontSize: "0.65rem",
                            fontFamily: "monospace",
                          }}
                        />
                        <Box sx={{ flex: 1 }} />
                        <Tooltip title="View in VR">
                          <IconButton
                            size="small"
                            href="/gym-view"
                            sx={{ color: colors.secondary }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => openEdit(floor)}
                            sx={{ color: "warning.main" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => openDelete(floor)}
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      ) : (
        <Card
          sx={{
            textAlign: "center",
            border: `2px dashed ${alpha(colors.primary, 0.2)}`,
            boxShadow: "none",
            bgcolor: "transparent",
            mt: 2,
          }}
        >
          <EmptyState
            message="No Floors Yet. Upload 360° panorama images to create your virtual gym walkthrough."
            icon={Panorama}
            action={openAdd}
            actionLabel="Upload First Floor"
          />
        </Card>
      )}

      {/* Lazy Loaded Modal */}
      <Suspense fallback={null}>
        {(modalType === "add" || modalType === "edit") && (
          <FloorFormModal
            open={true}
            editing={modalType === "edit"}
            uploading={uploading}
            formData={formData}
            panoramaPreview={panoramaPreview}
            previewPreview={previewPreview}
            colors={colors}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSave={handleSave}
            onClose={() => setModalType("")}
          />
        )}
      </Suspense>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={modalType === "delete"}
        title="Delete Floor?"
        description={`Are you sure you want to delete "${currentItem.current?.name || "this floor"}" and all its images?`}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onClose={() => setModalType("")}
      />
    </Box>
  );
};

export default FloorManagement;
