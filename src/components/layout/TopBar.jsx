import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  useMediaQuery,
  useTheme,
  InputBase,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { selectThemeColors } from "../../features/vr/vrThemeSlice";

const TopBar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const themeColors = useSelector(selectThemeColors);
  const primary = themeColors?.primary || "#39FF14";

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: alpha("#fff", 0.05),
            borderRadius: 2,
            px: 2,
            py: 0.5,
            flex: 1,
            maxWidth: 400,
            border: `1px solid ${alpha("#94A3B8", 0.1)}`,
            "&:focus-within": { borderColor: alpha(primary, 0.3) },
            transition: "all 0.3s ease",
          }}
        >
          <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
          <InputBase
            placeholder="Search members, payments..."
            sx={{
              flex: 1,
              color: "#F1F5F9",
              fontSize: "0.875rem",
              "&::placeholder": { color: "#64748B" },
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Notification */}
        <IconButton color="inherit" onClick={() => navigate("/notifications")}>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={handleProfileMenu}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontWeight: 700,
              fontSize: "0.875rem",
              bgcolor: alpha(primary, 0.15),
              color: primary,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          {!isMobile && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, fontSize: "0.8rem", lineHeight: 1.2 }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#94A3B8", fontSize: "0.65rem" }}
              >
                {user?.role?.toUpperCase()}
              </Typography>
            </Box>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
        >
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              navigate("/profile");
            }}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "#FF3131" }}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
