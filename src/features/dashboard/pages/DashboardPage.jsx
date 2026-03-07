import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  People,
  TrendingUp,
  CardMembership,
  AttachMoney,
  Warning,
  Cake,
  FitnessCenter,
  CalendarMonth,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { dashboardService } from "../services/dashboardService";
import toast from "react-hot-toast";

const chartColors = [
  "#39FF14",
  "#00F5FF",
  "#FF6B35",
  "#FF3131",
  "#FFB800",
  "#A855F7",
];

const StatCard = ({ title, value, icon, color, subtitle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#94A3B8",
                fontWeight: 500,
                mb: 0.5,
                textTransform: "uppercase",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, fontFamily: "Outfit", lineHeight: 1 }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: color,
                  fontWeight: 600,
                  mt: 0.5,
                  display: "block",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: alpha(color, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getAdmin();
        setData(res.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
        // Use mock data for demo
        setData({
          stats: {
            totalMembers: 8,
            activeMembers: 6,
            expiredMembers: 2,
            totalTrainers: 2,
            totalRevenue: 24994,
            monthlyRevenue: 7498,
          },
          upcomingExpiries: [],
          birthdays: [],
          revenueChart: [
            { _id: { year: 2024, month: 9 }, total: 4500, count: 3 },
            { _id: { year: 2024, month: 10 }, total: 6200, count: 5 },
            { _id: { year: 2024, month: 11 }, total: 5800, count: 4 },
            { _id: { year: 2024, month: 12 }, total: 8494, count: 6 },
          ],
          recentPayments: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton
                variant="rounded"
                height={140}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const { stats, upcomingExpiries, birthdays, revenueChart, recentPayments } =
    data;

  const revenueData = revenueChart.map((r) => ({
    month: `${r._id.month}/${r._id.year}`,
    revenue: r.total,
    count: r.count,
  }));

  const memberDistribution = [
    { name: "Active", value: stats.activeMembers },
    { name: "Expired", value: stats.expiredMembers },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 0.5 }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "#94A3B8" }}>
          Welcome back! Here's what's happening at your gym today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<People sx={{ color: "#39FF14", fontSize: 28 }} />}
            color="#39FF14"
            subtitle={`${stats.activeMembers} active`}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Members"
            value={stats.activeMembers}
            icon={<CardMembership sx={{ color: "#00F5FF", fontSize: 28 }} />}
            color="#00F5FF"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue?.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: "#FFB800", fontSize: 28 }} />}
            color="#FFB800"
            subtitle={`₹${stats.monthlyRevenue?.toLocaleString()} this month`}
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Trainers"
            value={stats.totalTrainers}
            icon={<FitnessCenter sx={{ color: "#FF6B35", fontSize: 28 }} />}
            color="#FF6B35"
            delay={0.3}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Revenue Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha("#94A3B8", 0.1)}
                  />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "none",
                      borderRadius: 8,
                      color: "#F1F5F9",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#39FF14"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Member Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={memberDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {memberDistribution.map((entry, index) => (
                      <Cell key={index} fill={chartColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "none",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Birthday Highlights & Upcoming Expiries */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Cake sx={{ color: "#FF6B35" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Birthday Highlights
                </Typography>
              </Box>
              {birthdays && birthdays.length > 0 ? (
                birthdays.map((b, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 1,
                      borderBottom: `1px solid ${alpha("#94A3B8", 0.08)}`,
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: alpha("#FF6B35", 0.15), color: "#FF6B35" }}
                    >
                      {b.userId?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {b.userId?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                        🎂 Happy Birthday!
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 3, color: "#64748B" }}>
                  <Cake sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">No birthdays today</Typography>
                </Box>
              )}
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Warning sx={{ color: "#FF3131" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Upcoming Expiries
                </Typography>
              </Box>
              {upcomingExpiries && upcomingExpiries.length > 0 ? (
                upcomingExpiries.map((m, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom: `1px solid ${alpha("#94A3B8", 0.08)}`,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{ width: 32, height: 32, fontSize: "0.8rem" }}
                      >
                        {m.userId?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {m.userId?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                          {m.membershipPlan?.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={new Date(m.expiryDate).toLocaleDateString()}
                      size="small"
                      sx={{
                        bgcolor: alpha("#FF3131", 0.1),
                        color: "#FF3131",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 3, color: "#64748B" }}>
                  <CalendarMonth sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">
                    No upcoming expiries this week
                  </Typography>
                </Box>
              )}
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

const TrainerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getTrainer();
        setData(res.data.data);
      } catch {
        setData({
          assignedMembers: [],
          totalAssigned: 0,
          todayAttendance: [],
          todayPresent: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Skeleton variant="rounded" height={400} />;

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 3 }}
      >
        Trainer Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Assigned Members"
            value={data?.totalAssigned || 0}
            icon={<People sx={{ color: "#00F5FF", fontSize: 28 }} />}
            color="#00F5FF"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Present Today"
            value={data?.todayPresent || 0}
            icon={<CalendarMonth sx={{ color: "#39FF14", fontSize: 28 }} />}
            color="#39FF14"
          />
        </Grid>
      </Grid>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Assigned Members
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Plan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.assignedMembers?.length > 0 ? (
                data.assignedMembers.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{ width: 32, height: 32, fontSize: "0.8rem" }}
                        >
                          {m.userId?.name?.charAt(0)}
                        </Avatar>
                        {m.userId?.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={m.status}
                        size="small"
                        sx={{
                          bgcolor: alpha(
                            m.status === "active" ? "#39FF14" : "#FF3131",
                            0.1,
                          ),
                          color: m.status === "active" ? "#39FF14" : "#FF3131",
                        }}
                      />
                    </TableCell>
                    <TableCell>{m.membershipPlan?.name || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ textAlign: "center", py: 4, color: "#64748B" }}
                  >
                    No members assigned yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getMember();
        setData(res.data.data);
      } catch {
        setData({
          profile: {
            status: "active",
            membershipPlan: { name: "Gold" },
            bmi: 24.2,
            bmiCategory: "Normal",
          },
          attendance: { last30Days: 20, percentage: 67 },
          recentPayments: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Skeleton variant="rounded" height={400} />;

  const bmiColor =
    data?.profile?.bmiCategory === "Normal"
      ? "#39FF14"
      : data?.profile?.bmiCategory === "Overweight"
        ? "#FFB800"
        : "#FF3131";

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 3 }}
      >
        My Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Membership Status"
            value={data?.profile?.status?.toUpperCase() || "N/A"}
            icon={<CardMembership sx={{ color: "#39FF14", fontSize: 28 }} />}
            color="#39FF14"
            subtitle={data?.profile?.membershipPlan?.name}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="BMI Score"
            value={data?.profile?.bmi || "N/A"}
            icon={<FitnessCenter sx={{ color: bmiColor, fontSize: 28 }} />}
            color={bmiColor}
            subtitle={data?.profile?.bmiCategory}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance (30d)"
            value={`${data?.attendance?.percentage || 0}%`}
            icon={<CalendarMonth sx={{ color: "#00F5FF", fontSize: 28 }} />}
            color="#00F5FF"
            subtitle={`${data?.attendance?.last30Days || 0} days`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Trainer"
            value={data?.profile?.trainerId?.name || "Not Assigned"}
            icon={<People sx={{ color: "#FF6B35", fontSize: 28 }} />}
            color="#FF6B35"
          />
        </Grid>
      </Grid>

      {/* Attendance Progress */}
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Attendance Progress
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={data?.attendance?.percentage || 0}
              sx={{
                height: 12,
                borderRadius: 6,
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #39FF14, #00E676)",
                  borderRadius: 6,
                },
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#39FF14", minWidth: 50 }}
          >
            {data?.attendance?.percentage || 0}%
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "admin" || user?.role === "owner")
    return <AdminDashboard />;
  if (user?.role === "trainer") return <TrainerDashboard />;
  return <MemberDashboard />;
};

export default DashboardPage;
