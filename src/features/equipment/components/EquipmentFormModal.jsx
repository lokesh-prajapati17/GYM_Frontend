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

const EquipmentFormModal = ({
  open,
  type,
  formData,
  onChange,
  onSubmit,
  onClose,
}) => {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
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
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {type === "edit" ? "Edit Equipment" : "Add Equipment"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormGrid columns={1} spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="name"
              label="Equipment Name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              fullWidth
              required
            />
          </FormGrid>

          <FormGrid columns={2} spacing={2} sx={{ mt: 0 }}>
            <TextField
              select
              name="category"
              label="Category"
              value={formData.category}
              onChange={(e) => onChange("category", e.target.value)}
              fullWidth
            >
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="strength">Strength</MenuItem>
              <MenuItem value="free_weights">Free Weights</MenuItem>
              <MenuItem value="machines">Machines</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <TextField
              select
              name="status"
              label="Status"
              value={formData.status}
              onChange={(e) => onChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="maintenance">Under Maintenance</MenuItem>
              <MenuItem value="retired">Retired</MenuItem>
            </TextField>
          </FormGrid>

          <FormGrid columns={2} spacing={2} sx={{ mt: 0 }}>
            <TextField
              type="date"
              name="lastMaintenanceDate"
              label="Last Maintenance"
              value={formData.lastMaintenanceDate}
              onChange={(e) => onChange("lastMaintenanceDate", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              name="nextMaintenanceDate"
              label="Next Maintenance"
              value={formData.nextMaintenanceDate}
              onChange={(e) => onChange("nextMaintenanceDate", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </FormGrid>

          <FormGrid columns={1} spacing={2} sx={{ mt: 0 }}>
            <TextField
              name="notes"
              label="Notes"
              value={formData.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </FormGrid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
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
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EquipmentFormModal;
