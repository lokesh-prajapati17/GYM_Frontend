import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  alpha,
} from "@mui/material";
import { paymentService } from "../services/paymentService";
import toast from "react-hot-toast";

const RecordPaymentModal = ({
  open,
  members,
  packages,
  onClose,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    method: "cash",
    packageId: "",
    description: "",
    status: "paid",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        memberId: "",
        amount: "",
        method: "cash",
        packageId: "",
        description: "",
        status: "paid",
      });
    }
  }, [open]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePackageChange = (packageId) => {
    const pkg = packages.find((p) => p._id === packageId);
    setFormData((prev) => ({
      ...prev,
      packageId,
      amount: pkg ? pkg.price : prev.amount,
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.memberId || !formData.amount) {
        toast.error("Member and Amount are required");
        return;
      }
      setSaving(true);
      await paymentService.create(formData);
      toast.success("Payment recorded");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Record Payment</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Member"
              value={formData.memberId}
              onChange={(e) => handleChange("memberId", e.target.value)}
            >
              <MenuItem value="" disabled>
                Select a Member
              </MenuItem>
              {members.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name} ({m.phone})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Package/Plan"
              value={formData.packageId}
              onChange={(e) => handlePackageChange(e.target.value)}
            >
              <MenuItem value="">None / Custom Payment</MenuItem>
              {packages.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name} - ₹{p.price}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Method"
              value={formData.method}
              onChange={(e) => handleChange("method", e.target.value)}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description / Notes"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#94A3B8", textTransform: "none" }}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            fontWeight: "bold",
            bgcolor: "#39FF14",
            color: "#000",
            "&:hover": { bgcolor: alpha("#39FF14", 0.8) },
          }}
        >
          {saving ? (
            <CircularProgress size={24} sx={{ color: "#000" }} />
          ) : (
            "Record Payment"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordPaymentModal;
