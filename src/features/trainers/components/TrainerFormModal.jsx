import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import { FormGrid } from "../../../components/common";

const TrainerFormModal = ({
  open,
  type,
  formData,
  branches,
  isOwner,
  userBranchId,
  onChange,
  onSubmit,
  onClose,
}) => {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(e);
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
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {type === "edit" ? "Edit Trainer" : "Add New Trainer"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleFormSubmit}>
        <DialogContent>
          <FormGrid columns={1} spacing={2}>
            {isOwner ? (
              <TextField
                fullWidth
                select
                label="Assign to Branch"
                value={formData.branchId}
                onChange={(e) => onChange("branchId", e.target.value)}
                required
                helperText="Select which branch this trainer will work at"
              >
                <MenuItem value="" disabled>
                  Select a branch
                </MenuItem>
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
                helperText="Trainer is assigned to your branch"
              />
            )}

            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />

            {type !== "edit" && (
              <TextField
                fullWidth
                label="Password (Optional)"
                type="password"
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
                helperText="Leave blank to auto-generate and email the trainer"
              />
            )}
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
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? (
              <CircularProgress
                size={24}
                sx={{ color: theme.palette.primary.contrastText }}
              />
            ) : type === "edit" ? (
              "Update Trainer"
            ) : (
              "Add Trainer"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TrainerFormModal;
