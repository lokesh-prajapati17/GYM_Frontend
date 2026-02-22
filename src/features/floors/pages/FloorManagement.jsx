import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  alpha,
  Skeleton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  CloudUpload,
  Image,
  Panorama,
  DragIndicator,
  Visibility,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { selectThemeColors } from "../../../features/vr/vrThemeSlice";
import { floorService } from "../services/floorService";
import toast from "react-hot-toast";

const FloorManagement = () => {
  const colors = useSelector(selectThemeColors);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    order: 0,
    description: "",
  });
  const [panoramaFile, setPanoramaFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [panoramaPreview, setPanoramaPreview] = useState(null);
  const [previewPreview, setPreviewPreview] = useState(null);

  const panoramaInputRef = useRef(null);
  const previewInputRef = useRef(null);

  const fetchFloors = async () => {
    setLoading(true);
    try {
      const res = await floorService.getAll();
      setFloors(res.data.data);
    } catch {
      setFloors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  const openDialog = (floor = null) => {
    if (floor) {
      setEditing(floor);
      setFormData({
        name: floor.name,
        slug: floor.slug,
        order: floor.order,
        description: floor.description || "",
      });
      setPanoramaPreview(floor.panoramaImage || null);
      setPreviewPreview(floor.previewImage || null);
    } else {
      setEditing(null);
      setFormData({
        name: "",
        slug: "",
        order: floors.length,
        description: "",
      });
      setPanoramaPreview(null);
      setPreviewPreview(null);
    }
    setPanoramaFile(null);
    setPreviewFile(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
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

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      slug: editing
        ? formData.slug
        : name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 50),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }
    if (!editing && !panoramaFile) {
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

      if (editing) {
        await floorService.update(editing._id, fd);
        toast.success("Floor updated successfully");
      } else {
        await floorService.create(fd);
        toast.success("Floor created successfully");
      }

      setDialogOpen(false);
      fetchFloors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this floor and all its images?")) return;
    try {
      await floorService.delete(id);
      toast.success("Floor deleted");
      fetchFloors();
    } catch {
      toast.error("Delete failed");
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
            Floor Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Upload 360° panoramas and manage gym floors for the VR experience
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => openDialog()}
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
      <Grid container spacing={3}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton
                variant="rounded"
                height={280}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))
        ) : floors.length > 0 ? (
          floors.map((floor, i) => (
            <Grid item xs={12} sm={6} md={4} key={floor._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  sx={{
                    overflow: "hidden",
                    border: `1px solid ${alpha(colors.primary, 0.1)}`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: colors.primary,
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
                      <DragIndicator sx={{ color: "#64748B", fontSize: 16 }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, flex: 1, fontSize: "1rem" }}
                      >
                        {floor.name}
                      </Typography>
                      <Chip
                        label={`#${floor.order}`}
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
                        color: "#94A3B8",
                        fontSize: "0.8rem",
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
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
                        sx={{ fontSize: "0.65rem" }}
                      />
                      <Chip
                        label={floor.slug}
                        size="small"
                        sx={{
                          bgcolor: alpha("#94A3B8", 0.08),
                          color: "#94A3B8",
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
                          onClick={() => openDialog(floor)}
                          sx={{ color: "#FFB800" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(floor._id)}
                          sx={{ color: "#FF3131" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card
              sx={{
                p: 6,
                textAlign: "center",
                border: `2px dashed ${alpha(colors.primary, 0.2)}`,
              }}
            >
              <Panorama
                sx={{
                  fontSize: 64,
                  color: alpha(colors.primary, 0.15),
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ color: "#64748B", mb: 1 }}>
                No Floors Yet
              </Typography>
              <Typography variant="body2" sx={{ color: "#475569", mb: 3 }}>
                Upload 360° panorama images to create your virtual gym
                walkthrough
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => openDialog()}
                sx={{
                  bgcolor: colors.primary,
                  color: "#0A0A0A",
                }}
              >
                Upload First Floor
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !uploading && setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editing ? "Edit Floor" : "Add New Floor"}
        </DialogTitle>
        {uploading && (
          <LinearProgress
            sx={{
              bgcolor: alpha(colors.primary, 0.1),
              "& .MuiLinearProgress-bar": { bgcolor: colors.primary },
            }}
          />
        )}
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Floor Name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Floor 1 - Cardio Zone"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                InputProps={{ style: { fontFamily: "monospace" } }}
                disabled={!!editing}
                helperText={editing ? "Slug cannot be changed" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>

            {/* Panorama Upload */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: "#F1F5F9" }}
              >
                360° Panorama Image *
              </Typography>
              <Box
                onClick={() => panoramaInputRef.current?.click()}
                sx={{
                  height: 180,
                  borderRadius: 2,
                  border: `2px dashed ${alpha(colors.primary, 0.3)}`,
                  bgcolor: alpha(colors.primary, 0.02),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: colors.primary,
                    bgcolor: alpha(colors.primary, 0.05),
                  },
                }}
              >
                {panoramaPreview ? (
                  <img
                    src={panoramaPreview}
                    alt="Panorama preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <Panorama
                      sx={{
                        fontSize: 40,
                        color: alpha(colors.primary, 0.3),
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Click to upload (2:1 ratio, max 10MB)
                    </Typography>
                  </>
                )}
              </Box>
              <input
                ref={panoramaInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "panorama")}
              />
            </Grid>

            {/* Preview Upload */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: "#F1F5F9" }}
              >
                Preview Image (Optional)
              </Typography>
              <Box
                onClick={() => previewInputRef.current?.click()}
                sx={{
                  height: 180,
                  borderRadius: 2,
                  border: `2px dashed ${alpha("#94A3B8", 0.15)}`,
                  bgcolor: alpha("#94A3B8", 0.02),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: alpha("#94A3B8", 0.3) },
                }}
              >
                {previewPreview ? (
                  <img
                    src={previewPreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <Image
                      sx={{
                        fontSize: 40,
                        color: alpha("#94A3B8", 0.2),
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Click to upload (16:9 ratio)
                    </Typography>
                  </>
                )}
              </Box>
              <input
                ref={previewInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "preview")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={uploading}
            sx={{ color: "#94A3B8" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={uploading}
            startIcon={uploading ? null : <CloudUpload />}
            sx={{
              bgcolor: colors.primary,
              color: "#0A0A0A",
              "&:hover": { bgcolor: alpha(colors.primary, 0.85) },
            }}
          >
            {uploading
              ? "Uploading..."
              : editing
                ? "Update Floor"
                : "Create Floor"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FloorManagement;
