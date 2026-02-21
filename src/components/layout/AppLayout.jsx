import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import Sidebar, { DRAWER_WIDTH, DRAWER_COLLAPSED } from "./Sidebar";
import TopBar from "./TopBar";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = isMobile
    ? 0
    : sidebarOpen
      ? DRAWER_WIDTH
      : DRAWER_COLLAPSED;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
