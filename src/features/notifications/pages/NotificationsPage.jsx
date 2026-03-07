import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Notifications as NotifIcon,
  Circle,
  MarkEmailRead,
  DoneAll,
  CardMembership,
  Payment,
  Cake,
  Info,
  FitnessCenter,
  EventAvailable,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { notificationService } from "../services/notificationService";
import toast from "react-hot-toast";
import { CommonCard, PageLoader, EmptyState } from "../../../components/common";

const NotificationsPage = () => {
  const theme = useTheme();

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const typeIcons = {
    membership_expiry: (
      <CardMembership sx={{ color: theme.palette.error.main }} />
    ),
    payment_due: <Payment sx={{ color: theme.palette.warning.main }} />,
    birthday: <Cake sx={{ color: "#FF6B35" }} />,
    special_offer: <Info sx={{ color: "#A855F7" }} />,
    workout_assigned: (
      <FitnessCenter sx={{ color: theme.palette.success.main }} />
    ),
    attendance: <EventAvailable sx={{ color: theme.palette.info.main }} />,
    general: <NotifIcon sx={{ color: theme.palette.text.secondary }} />,
  };

  const typeColors = {
    membership_expiry: theme.palette.error.main,
    payment_due: theme.palette.warning.main,
    birthday: "#FF6B35",
    special_offer: "#A855F7",
    workout_assigned: theme.palette.success.main,
    attendance: theme.palette.info.main,
    general: theme.palette.text.secondary,
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getAll();
      if (res?.data?.data) {
        setData(res.data.data);
        setUnreadCount(res.data.unreadCount || 0);
      } else {
        setData([]);
      }
    } catch {
      // Fallback dummy data for demo
      setData([
        {
          _id: "1",
          type: "membership_expiry",
          title: "Membership Expiring",
          message: "Arjun Menon's membership expires in 3 days",
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          type: "payment_due",
          title: "Payment Pending",
          message: "Vikram Reddy has a pending payment of ₹7,999",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: "3",
          type: "birthday",
          title: "Birthday Today!",
          message: "Kavya Nair turns 27 today! 🎂",
          read: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          _id: "4",
          type: "workout_assigned",
          title: "Workout Plan Updated",
          message: "New workout plan assigned to Amit Kumar",
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
      setUnreadCount(2);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setData((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setData((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Notifications
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {unreadCount} unread notifications
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={handleMarkAllRead}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
            }}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      <CommonCard sx={{ p: 0, overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <PageLoader />
          </Box>
        ) : data.length > 0 ? (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {data.map((n, i) => {
                const bgAlpha = !n.read ? 0.05 : 0;
                const brColor = !n.read
                  ? typeColors[n.type] || theme.palette.primary.main
                  : "transparent";

                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        bgcolor: alpha(
                          typeColors[n.type] || theme.palette.text.secondary,
                          bgAlpha,
                        ),
                        borderLeft: `3px solid ${brColor}`,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.text.primary, 0.02),
                        },
                      }}
                      secondaryAction={
                        !n.read && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkRead(n._id)}
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            <MarkEmailRead fontSize="small" />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemIcon>
                        {typeIcons[n.type] || typeIcons.general}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: !n.read ? 700 : 500 }}
                            >
                              {n.title}
                            </Typography>
                            {!n.read && (
                              <Circle
                                sx={{
                                  fontSize: 8,
                                  color:
                                    typeColors[n.type] ||
                                    theme.palette.primary.main,
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.8rem",
                              }}
                            >
                              {n.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.disabled,
                                whiteSpace: "nowrap",
                                ml: 2,
                              }}
                            >
                              {timeAgo(n.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < data.length - 1 && (
                      <Divider sx={{ borderColor: theme.palette.divider }} />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </List>
        ) : (
          <EmptyState message="No notifications yet" icon={NotifIcon} />
        )}
      </CommonCard>
    </Box>
  );
};

export default NotificationsPage;
