import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import { FormGrid } from "../../../components/common";

const MembershipFormModal = ({
  open,
  type,
  formData,
  branches,
  isOwner,
  userBranchId,
  onChange,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {type === "edit" ? "Edit Package" : "Add Package"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormGrid columns={1} spacing={2} sx={{ mt: 1 }}>
          {isOwner ? (
            <TextField
              fullWidth
              select
              label="Assign to Branch (Optional)"
              value={formData.branch}
              onChange={(e) => onChange("branch", e.target.value)}
              helperText="Leave empty for org-wide plan, or select a specific branch"
            >
              <MenuItem value="">All Branches (Org-wide)</MenuItem>
              {branches.map((b) => (
                <MenuItem key={b._id} value={b._id}>
                  {b.name}
                  {b.isMainBranch ? " ⭐ (Main)" : ""}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              fullWidth
              label="Branch"
              value={
                branches.find((b) => b._id === userBranchId)?.name ||
                "Your Branch"
              }
              disabled
              helperText="Plan will be created for your branch"
            />
          )}

          <TextField
            fullWidth
            label="Package Name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </FormGrid>

        <FormGrid columns={2} spacing={2} sx={{ mt: 0 }}>
          <TextField
            fullWidth
            select
            label="Duration"
            value={formData.duration}
            onChange={(e) => onChange("duration", e.target.value)}
          >
            <MenuItem value={1}>1 Month</MenuItem>
            <MenuItem value={3}>3 Months</MenuItem>
            <MenuItem value={6}>6 Months</MenuItem>
            <MenuItem value={12}>1 Year</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Price (₹)"
            type="number"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </FormGrid>

        <FormGrid columns={1} spacing={2} sx={{ mt: 0 }}>
          <TextField
            fullWidth
            label="Features (comma separated)"
            value={formData.features}
            onChange={(e) => onChange("features", e.target.value)}
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            multiline
            rows={2}
          />
        </FormGrid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: theme.palette.text.secondary }}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <CircularProgress
              size={24}
              sx={{ color: theme.palette.primary.contrastText }}
            />
          ) : type === "edit" ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipFormModal;
