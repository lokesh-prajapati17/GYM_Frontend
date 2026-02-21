import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Button,
  alpha,
  Skeleton,
  Divider,
} from "@mui/material";
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
import { notificationService } from "../../services/services";
import toast from "react-hot-toast";

const typeIcons = {
  membership_expiry: <CardMembership sx={{ color: "#FF3131" }} />,
  payment_due: <Payment sx={{ color: "#FFB800" }} />,
  birthday: <Cake sx={{ color: "#FF6B35" }} />,
  special_offer: <Info sx={{ color: "#A855F7" }} />,
  workout_assigned: <FitnessCenter sx={{ color: "#39FF14" }} />,
  attendance: <EventAvailable sx={{ color: "#00F5FF" }} />,
  general: <NotifIcon sx={{ color: "#94A3B8" }} />,
};

const typeColors = {
  membership_expiry: "#FF3131",
  payment_due: "#FFB800",
  birthday: "#FF6B35",
  special_offer: "#A855F7",
  workout_assigned: "#39FF14",
  attendance: "#00F5FF",
  general: "#94A3B8",
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch {
      setNotifications([
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch {}
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
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
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: "Outfit" }}
          >
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            {unreadCount} unread notifications
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={handleMarkAllRead}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      <Card>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Box key={i} sx={{ p: 2 }}>
              <Skeleton height={60} />
            </Box>
          ))
        ) : notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {notifications.map((n, i) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      bgcolor: !n.read
                        ? alpha(typeColors[n.type] || "#94A3B8", 0.03)
                        : "transparent",
                      borderLeft: !n.read
                        ? `3px solid ${typeColors[n.type] || "#94A3B8"}`
                        : "3px solid transparent",
                      "&:hover": { bgcolor: alpha("#fff", 0.02) },
                    }}
                    secondaryAction={
                      !n.read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkRead(n._id)}
                          sx={{ color: "#94A3B8" }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: !n.read ? 700 : 500 }}
                          >
                            {n.title}
                          </Typography>
                          {!n.read && (
                            <Circle
                              sx={{ fontSize: 8, color: typeColors[n.type] }}
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
                            sx={{ color: "#94A3B8", fontSize: "0.8rem" }}
                          >
                            {n.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748B",
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
                  {i < notifications.length - 1 && (
                    <Divider sx={{ borderColor: alpha("#94A3B8", 0.06) }} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <NotifIcon
              sx={{ fontSize: 48, color: "#64748B", opacity: 0.3, mb: 1 }}
            />
            <Typography variant="h6" sx={{ color: "#64748B" }}>
              No notifications yet
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default NotificationsPage;
