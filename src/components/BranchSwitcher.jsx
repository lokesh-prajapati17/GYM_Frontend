import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  alpha,
  useTheme,
} from "@mui/material";
import {
  KeyboardArrowDown as ArrowDownIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import { selectBranch } from "../features/auth/authSlice";
const BranchSwitcher = () => {
  const { branches, activeBranchId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  // If user only has access to 0 or 1 branch, hide switcher
  if (!branches || branches.length <= 1) return null;

  const activeBranch =
    branches.find((b) => b._id === activeBranchId) || branches[0];

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelectBranch = async (branchId) => {
    handleClose();
    if (branchId === activeBranchId) return;

    try {
      await dispatch(selectBranch({ branchId })).unwrap();
      // Reload page to force entire app/data to refresh with new x-branch-id header
      window.location.reload();
    } catch (err) {
      console.error("Failed to switch branch:", err);
    }
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 0.75,
          cursor: "pointer",
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.15),
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
        }}
      >
        <StoreIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="caption"
            sx={{
              color: "#94A3B8",
              fontSize: "0.65rem",
              lineHeight: 1,
              mb: 0.25,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Active Branch
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#F8FAFC",
              fontSize: "0.85rem",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {activeBranch?.name || "Select Branch"}
          </Typography>
        </Box>
        <ArrowDownIcon
          sx={{
            color: "#94A3B8",
            fontSize: 18,
            transition: "transform 0.2s",
            transform: anchorEl ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            bgcolor: "#1E293B",
            border: `1px solid ${alpha("#FFFFFF", 0.1)}`,
            borderRadius: 2,
          },
        }}
      >
        {branches.map((branch) => {
          const isActive = branch._id === activeBranchId;
          return (
            <MenuItem
              key={branch._id}
              onClick={() => handleSelectBranch(branch._id)}
              disabled={isActive}
              sx={{
                py: 1.5,
                px: 2,
                gap: 1.5,
                opacity: isActive ? 0.7 : 1,
                bgcolor: isActive
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
              }}
            >
              <StoreIcon
                sx={{
                  color: isActive ? theme.palette.primary.main : "#94A3B8",
                  fontSize: 18,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isActive ? theme.palette.primary.main : "#F8FAFC",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {branch.name}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default BranchSwitcher;
