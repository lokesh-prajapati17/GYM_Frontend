import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  IconButton,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Store as StoreIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { branchService } from "../services/branchService";

const BranchFormModal = ({
  open,
  type, // "add" | "edit"
  currentItem, // ref object passing { current: branchData }
  formData,
  setFormData,
  logoPreview,
  setLogoPreview,
  setLogoFile,
  primaryColor,
  onClose,
  onRefresh,
}) => {
  const fileInputRef = useRef(null);
  const [saving, setSaving] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file must be less than 5MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        floorCount: Number(formData.floorCount) || 1,
        vrEnabled: formData.vrEnabled,
        isActive: formData.isActive,
      };

      if (type === "edit" && currentItem.current?._id) {
        await branchService.updateBranch(currentItem.current._id, payload);
        toast.success("Branch updated successfully");
      } else {
        await branchService.createBranch(payload);
        toast.success("Branch added successfully");
      }
      onClose();
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1E293B",
          borderRadius: 3,
          border: "1px solid rgba(148, 163, 184, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#F1F5F9",
          fontWeight: 700,
          pb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {type === "edit" ? "Edit Branch" : "Add New Branch"}
        <IconButton onClick={onClose} size="small" sx={{ color: "#94A3B8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}
          >
            {/* Branch Logo Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={logoPreview || undefined}
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: alpha(primaryColor, 0.15),
                    color: primaryColor,
                    fontSize: "1.5rem",
                    border: `2px dashed ${alpha(primaryColor, 0.3)}`,
                  }}
                >
                  {formData.name?.charAt(0) || <StoreIcon />}
                </Avatar>
                {logoPreview && (
                  <IconButton
                    size="small"
                    onClick={handleRemoveLogo}
                    sx={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      bgcolor: "#FF3131",
                      color: "#fff",
                      width: 20,
                      height: 20,
                      "&:hover": { bgcolor: "#CC2727" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                )}
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    color: primaryColor,
                    borderColor: alpha(primaryColor, 0.3),
                    textTransform: "none",
                    "&:hover": { borderColor: primaryColor },
                  }}
                >
                  Upload Logo
                </Button>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#64748B", mt: 0.5 }}
                >
                  Max 5MB. JPEG, PNG, WebP, GIF
                </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleLogoChange}
                />
              </Box>
            </Box>

            {/* Branch Name */}
            <TextField
              name="name"
              label="Branch Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g. Andheri West Branch"
              sx={{ input: { color: "#F1F5F9" }, label: { color: "#94A3B8" } }}
            />

            {/* Phone */}
            <TextField
              name="phone"
              label="Contact Phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              placeholder="e.g. +91 9876543210"
              sx={{ input: { color: "#F1F5F9" }, label: { color: "#94A3B8" } }}
            />

            {/* Address Section */}
            <Typography
              variant="subtitle2"
              sx={{ color: "#94A3B8", fontWeight: 600, mt: 1 }}
            >
              Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="street"
                  label="Street Address"
                  value={formData.street}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. 123, MG Road"
                  sx={{
                    input: { color: "#F1F5F9" },
                    label: { color: "#94A3B8" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. Mumbai"
                  sx={{
                    input: { color: "#F1F5F9" },
                    label: { color: "#94A3B8" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. Maharashtra"
                  sx={{
                    input: { color: "#F1F5F9" },
                    label: { color: "#94A3B8" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="pincode"
                  label="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. 400058"
                  sx={{
                    input: { color: "#F1F5F9" },
                    label: { color: "#94A3B8" },
                  }}
                />
              </Grid>
            </Grid>

            {/* Facility Settings */}
            <Typography
              variant="subtitle2"
              sx={{ color: "#94A3B8", fontWeight: 600, mt: 1 }}
            >
              Facility Settings
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  name="floorCount"
                  label="Number of Floors"
                  type="number"
                  value={formData.floorCount}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 1 }}
                  sx={{
                    input: { color: "#F1F5F9" },
                    label: { color: "#94A3B8" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      name="vrEnabled"
                      checked={formData.vrEnabled}
                      onChange={handleChange}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#00F5FF",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#00F5FF",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
                      VR Enabled
                    </Typography>
                  }
                />
              </Grid>
              {type === "edit" && (
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#39FF14",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#39FF14",
                            },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
                        Active
                      </Typography>
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} sx={{ color: "#94A3B8" }} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{
              bgcolor: primaryColor,
              color: "#0A0A0A",
              "&:hover": { bgcolor: alpha(primaryColor, 0.8) },
            }}
          >
            {saving ? (
              <CircularProgress size={24} sx={{ color: "#0A0A0A" }} />
            ) : type === "edit" ? (
              "Update Branch"
            ) : (
              "Create Branch"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BranchFormModal;
