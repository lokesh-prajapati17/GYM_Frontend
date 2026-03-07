import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  alpha,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FitnessCenter as FitnessIcon,
  CardMembership as MembershipIcon,
  Payment as PaymentIcon,
  EventAvailable as AttendanceIcon,
  Notifications as NotificationsIcon,
  SportsMartialArts as TrainerIcon,
  Calculate as CalculateIcon,
  ViewInAr as ThreeDIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Layers as FloorIcon,
  LockOutlined as LockIcon,
  Build as BuildIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import { logout } from "../../features/auth/authSlice";
import { selectThemeColors } from "../../features/vr/vrThemeSlice";
import useSubscription from "../../hooks/useSubscription";

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED = 72;

const menuItems = {
  owner: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Members", icon: <PeopleIcon />, path: "/members" },
    { text: "Trainers", icon: <TrainerIcon />, path: "/trainers" },
    { text: "Memberships", icon: <MembershipIcon />, path: "/memberships" },
    { text: "Payments", icon: <PaymentIcon />, path: "/payments" },
    { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
    { text: "Workouts", icon: <FitnessIcon />, path: "/workouts" },
    { text: "Equipment", icon: <BuildIcon />, path: "/equipment" },
    { text: "Branches", icon: <StoreIcon />, path: "/branches" },
    { text: "BMI Calculator", icon: <CalculateIcon />, path: "/bmi" },
    {
      text: "3D Gym View",
      icon: <ThreeDIcon />,
      path: "/gym-view",
      requiredFeature: "vrEnabled",
    },
    {
      text: "Floor Management",
      icon: <FloorIcon />,
      path: "/floor-management",
      requiredFeature: "multiCitySupport",
    },
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
  ],
  admin: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Members", icon: <PeopleIcon />, path: "/members" },
    { text: "Trainers", icon: <TrainerIcon />, path: "/trainers" },
    { text: "Memberships", icon: <MembershipIcon />, path: "/memberships" },
    { text: "Payments", icon: <PaymentIcon />, path: "/payments" },
    { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
    { text: "Workouts", icon: <FitnessIcon />, path: "/workouts" },
    { text: "Equipment", icon: <BuildIcon />, path: "/equipment" },
    { text: "BMI Calculator", icon: <CalculateIcon />, path: "/bmi" },
    {
      text: "3D Gym View",
      icon: <ThreeDIcon />,
      path: "/gym-view",
      requiredFeature: "vrEnabled",
    },
    {
      text: "Floor Management",
      icon: <FloorIcon />,
      path: "/floor-management",
      requiredFeature: "multiCitySupport",
    },
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
  ],
  trainer: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "My Members", icon: <PeopleIcon />, path: "/members" },
    { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
    { text: "Workouts", icon: <FitnessIcon />, path: "/workouts" },
    { text: "BMI Calculator", icon: <CalculateIcon />, path: "/bmi" },
    {
      text: "3D Gym View",
      icon: <ThreeDIcon />,
      path: "/gym-view",
      requiredFeature: "vrEnabled",
    },
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
  ],
  member: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "My Profile", icon: <PeopleIcon />, path: "/profile" },
    { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
    { text: "My Workouts", icon: <FitnessIcon />, path: "/workouts" },
    { text: "Payments", icon: <PaymentIcon />, path: "/payments" },
    { text: "BMI Calculator", icon: <CalculateIcon />, path: "/bmi" },
    {
      text: "3D Gym View",
      icon: <ThreeDIcon />,
      path: "/gym-view",
      requiredFeature: "vrEnabled",
    },
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
  ],
};

const Sidebar = ({ open, onToggle, mobileOpen, onMobileClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { hasFeature } = useSubscription();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const items = menuItems[user?.role] || menuItems.member;
  const drawerWidth = open ? DRAWER_WIDTH : DRAWER_COLLAPSED;
  const themeColors = useSelector(selectThemeColors);
  const primary = themeColors?.primary || "#39FF14";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const drawerContent = (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", py: 1 }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${primary} 0%, ${themeColors?.secondary || "#00E676"} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FitnessIcon sx={{ color: "#0A0A0A", fontSize: 24 }} />
        </Box>
        {open && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Outfit",
              fontWeight: 800,
              color: primary,
              letterSpacing: "-0.02em",
            }}
          >
            GymPro
          </Typography>
        )}
      </Box>

      <Divider sx={{ mx: 2, borderColor: alpha("#94A3B8", 0.08) }} />

      {/* User Info */}
      {open && (
        <Box
          sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: alpha(primary, 0.15),
              color: primary,
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Chip
              label={user?.role?.toUpperCase()}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: alpha(
                  user?.role === "admin"
                    ? "#FF6B35"
                    : user?.role === "trainer"
                      ? "#00F5FF"
                      : primary,
                  0.15,
                ),
                color:
                  user?.role === "admin"
                    ? "#FF6B35"
                    : user?.role === "trainer"
                      ? "#00F5FF"
                      : primary,
              }}
            />
          </Box>
        </Box>
      )}

      <Divider sx={{ mx: 2, borderColor: alpha("#94A3B8", 0.08) }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked =
            item.requiredFeature && !hasFeature(item.requiredFeature);
          return (
            <Tooltip
              key={item.text}
              title={!open ? (isLocked ? `${item.text} (PRO)` : item.text) : ""}
              placement="right"
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? onMobileClose : undefined}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    px: open ? 2 : 2.5,
                    mx: 0.5,
                    justifyContent: open ? "initial" : "center",
                    bgcolor: isActive ? alpha(primary, 0.08) : "transparent",
                    borderLeft: isActive
                      ? `3px solid ${primary}`
                      : "3px solid transparent",
                    opacity: isLocked ? 0.6 : 1,
                    "&:hover": {
                      bgcolor: alpha(primary, 0.05),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: isLocked
                        ? alpha("#94A3B8", 0.5)
                        : isActive
                          ? primary
                          : "#94A3B8",
                    }}
                  >
                    {item.text === "Notifications" && unreadCount > 0 ? (
                      <Box sx={{ position: "relative" }}>
                        {item.icon}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            bgcolor: "#FF3131",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {unreadCount}
                        </Box>
                      </Box>
                    ) : isLocked ? (
                      <Box sx={{ position: "relative" }}>
                        {item.icon}
                        <LockIcon
                          sx={{
                            position: "absolute",
                            bottom: -4,
                            right: -6,
                            fontSize: 12,
                            color: "#FF6B35",
                          }}
                        />
                      </Box>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {open && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        gap: 1,
                      }}
                    >
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 600 : 400,
                          color: isLocked
                            ? alpha("#94A3B8", 0.5)
                            : isActive
                              ? "#F1F5F9"
                              : "#94A3B8",
                        }}
                      />
                      {isLocked && (
                        <Chip
                          label="PRO"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            bgcolor: alpha("#FF6B35", 0.15),
                            color: "#FF6B35",
                            border: `1px solid ${alpha("#FF6B35", 0.3)}`,
                            letterSpacing: "0.05em",
                          }}
                        />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, borderColor: alpha("#94A3B8", 0.08) }} />

      {/* Bottom Actions */}
      <List sx={{ px: 1, py: 1 }}>
        <Tooltip title={!open ? "Logout" : ""} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                minHeight: 44,
                px: open ? 2 : 2.5,
                mx: 0.5,
                justifyContent: open ? "initial" : "center",
                "&:hover": { bgcolor: alpha("#FF3131", 0.08) },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                  color: "#FF3131",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    color: "#FF3131",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>

      {/* Collapse Toggle */}
      {!isMobile && (
        <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{ color: "#94A3B8", "&:hover": { color: primary } }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export { DRAWER_WIDTH, DRAWER_COLLAPSED };
export default Sidebar;
