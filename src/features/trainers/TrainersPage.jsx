import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Avatar,
  Chip,
  alpha,
  Skeleton,
} from "@mui/material";
import { People, SportsMartialArts } from "@mui/icons-material";
import { motion } from "framer-motion";
import { dashboardService } from "../../services/services";

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await dashboardService.getTrainers();
        setTrainers(res.data.data);
      } catch {
        setTrainers([
          {
            _id: "1",
            name: "Rahul Sharma",
            email: "rahul@gym.com",
            phone: "9876543211",
            assignedMembersCount: 4,
          },
          {
            _id: "2",
            name: "Priya Singh",
            email: "priya@gym.com",
            phone: "9876543212",
            assignedMembersCount: 4,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 0.5 }}
      >
        Trainers
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mb: 3 }}>
        View and manage trainers
      </Typography>

      <Grid container spacing={3}>
        {loading
          ? [1, 2].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))
          : trainers.map((t, i) => (
              <Grid item xs={12} sm={6} md={4} key={t._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card sx={{ p: 3, textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 72,
                        height: 72,
                        mx: "auto",
                        mb: 2,
                        fontSize: "1.5rem",
                        bgcolor: alpha("#00F5FF", 0.15),
                        color: "#00F5FF",
                        fontWeight: 700,
                      }}
                    >
                      {t.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#94A3B8", mb: 1 }}
                    >
                      {t.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#94A3B8", mb: 2 }}
                    >
                      {t.phone}
                    </Typography>
                    <Chip
                      label={`${t.assignedMembersCount} Members Assigned`}
                      icon={<People sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: alpha("#39FF14", 0.1),
                        color: "#39FF14",
                        fontWeight: 600,
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default TrainersPage;
