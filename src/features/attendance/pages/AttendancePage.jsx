import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  Grid,
  alpha,
  Skeleton,
} from "@mui/material";
import { EventAvailable, PersonAdd } from "@mui/icons-material";
import { motion } from "framer-motion";
import { attendanceService } from "../services/attendanceService";
import toast from "react-hot-toast";

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getAll({ limit: 30 });
      setRecords(res.data.data);
    } catch {
      setRecords([
        {
          _id: "1",
          memberId: { name: "Amit Kumar" },
          date: new Date().toISOString(),
          checkIn: new Date().toISOString(),
          checkOut: null,
          method: "manual",
        },
        {
          _id: "2",
          memberId: { name: "Sneha Patel" },
          date: new Date().toISOString(),
          checkIn: new Date().toISOString(),
          checkOut: new Date().toISOString(),
          method: "manual",
        },
        {
          _id: "3",
          memberId: { name: "Vikram Reddy" },
          date: new Date(Date.now() - 86400000).toISOString(),
          checkIn: new Date(Date.now() - 86400000).toISOString(),
          checkOut: new Date(Date.now() - 86400000).toISOString(),
          method: "qr_code",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleMarkAttendance = async () => {
    if (!memberId) return toast.error("Enter member ID");
    try {
      const res = await attendanceService.mark({ memberId });
      toast.success(res.data.message || "Attendance marked");
      fetchRecords();
      setMemberId("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 0.5 }}
      >
        Attendance
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mb: 3 }}>
        Track member attendance
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EventAvailable sx={{ color: "#39FF14" }} /> Mark Attendance
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter Member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleMarkAttendance}
              startIcon={<PersonAdd />}
            >
              Check In / Out
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : records.map((r, i) => (
                    <motion.tr
                      key={r._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ display: "table-row" }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {r.memberId?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(r.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {r.checkIn
                          ? new Date(r.checkIn).toLocaleTimeString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {r.checkOut
                          ? new Date(r.checkOut).toLocaleTimeString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.method?.replace("_", " ")}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.7rem",
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.checkOut ? "Complete" : "Active"}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              r.checkOut ? "#39FF14" : "#FFB800",
                              0.1,
                            ),
                            color: r.checkOut ? "#39FF14" : "#FFB800",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                    </motion.tr>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AttendancePage;
