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
} from "@mui/material";
import { memberService } from "../services/memberService";
import toast from "react-hot-toast";

const MemberFormModal = ({
  open,
  type,
  currentItem,
  packages,
  trainers,
  onClose,
  onRefresh,
}) => {
  // FORM DATA MANAGEMENT
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    height: "",
    weight: "",
    dateOfBirth: "",
    gender: "",
    membershipPlan: "",
    trainerId: "",
    address: "",
    emergencyContact: "",
    bloodGroup: "",
    goals: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const member = currentItem?.current;
      if (member && type === "edit") {
        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          height: member.profile?.height || "",
          weight: member.profile?.weight || "",
          dateOfBirth: member.profile?.dateOfBirth
            ? member.profile.dateOfBirth.slice(0, 10)
            : "",
          gender: member.profile?.gender || "",
          membershipPlan: member.profile?.membershipPlan?._id || "",
          trainerId: member.profile?.trainerId?._id || "",
          address: member.profile?.address || "",
          emergencyContact: member.profile?.emergencyContact || "",
          bloodGroup: member.profile?.bloodGroup || "",
          goals: member.profile?.goals || "",
          password: "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "Member@123",
          height: "",
          weight: "",
          dateOfBirth: "",
          gender: "",
          membershipPlan: "",
          trainerId: "",
          address: "",
          emergencyContact: "",
          bloodGroup: "",
          goals: "",
        });
      }
    }
  }, [open, type, currentItem]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const payload = { ...formData };
      if (type === "edit") {
        if (!payload.password) delete payload.password;
        await memberService.update(currentItem.current._id, payload);
        toast.success("Member updated successfully");
      } else {
        await memberService.create(payload);
        toast.success("Member added successfully");
      }
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {type === "edit" ? "Edit Member" : "Add New Member"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid>
          {type === "add" && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Membership Plan"
              value={formData.membershipPlan}
              onChange={(e) => handleChange("membershipPlan", e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {packages.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name} - ₹{p.price}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Assign Trainer"
              value={formData.trainerId}
              onChange={(e) => handleChange("trainerId", e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {trainers?.map((t) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact"
              value={formData.emergencyContact}
              onChange={(e) => handleChange("emergencyContact", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Fitness Goals"
              multiline
              rows={2}
              value={formData.goals}
              onChange={(e) => handleChange("goals", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#94A3B8" }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : type === "edit" ? "Update" : "Add Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MemberFormModal;
