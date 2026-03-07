import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Warning as WarningIcon } from "@mui/icons-material";

const DeleteConfirmModal = ({
  open,
  title = "Delete Item?",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  image,
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: theme.palette.error.main,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <WarningIcon />
        {title}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            py: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {image && (
            <Box
              component="img"
              src={image}
              alt="Warning"
              sx={{
                width: 120,
                height: 120,
                objectFit: "contain",
                opacity: 0.9,
              }}
            />
          )}
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: image ? "center" : "left",
            }}
          >
            {description}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: theme.palette.text.secondary }}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
          sx={{
            bgcolor: theme.palette.error.main,
            color: "#fff",
            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.8) },
          }}
        >
          {isDeleting ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : (
            "Confirm Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
