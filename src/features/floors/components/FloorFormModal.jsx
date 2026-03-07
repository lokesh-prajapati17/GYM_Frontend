import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Grid,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Close as CloseIcon,
  CloudUpload,
  Image as ImageIcon,
  Panorama,
} from "@mui/icons-material";

const FloorFormModal = ({
  open,
  editing,
  uploading,
  formData,
  panoramaPreview,
  previewPreview,
  colors,
  onChange,
  onFileChange,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const panoramaInputRef = useRef(null);
  const previewInputRef = useRef(null);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !uploading && onClose()}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {editing ? "Edit Floor" : "Add New Floor"}
        </Typography>
        <IconButton
          onClick={() => !uploading && onClose()}
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
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
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Floor 1 - Cardio Zone"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Slug"
              value={formData.slug}
              onChange={(e) => onChange("slug", e.target.value)}
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
              onChange={(e) => onChange("order", parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </Grid>

          {/* Panorama Upload */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}
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
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                  >
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
              onChange={(e) => onFileChange(e, "panorama")}
            />
          </Grid>

          {/* Preview Upload */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}
            >
              Preview Image (Optional)
            </Typography>
            <Box
              onClick={() => previewInputRef.current?.click()}
              sx={{
                height: 180,
                borderRadius: 2,
                border: `2px dashed ${alpha(theme.palette.text.secondary, 0.15)}`,
                bgcolor: alpha(theme.palette.text.secondary, 0.02),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: alpha(theme.palette.text.secondary, 0.3),
                },
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
                  <ImageIcon
                    sx={{
                      fontSize: 40,
                      color: alpha(theme.palette.text.secondary, 0.2),
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                  >
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
              onChange={(e) => onFileChange(e, "preview")}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={uploading}
          sx={{ color: theme.palette.text.secondary }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
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
  );
};

export default FloorFormModal;
