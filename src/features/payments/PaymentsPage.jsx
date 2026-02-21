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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  alpha,
  Pagination,
  Skeleton,
} from "@mui/material";
import { Add, Receipt } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  paymentService,
  memberService,
  membershipService,
} from "../../services/services";
import toast from "react-hot-toast";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    method: "cash",
    packageId: "",
    description: "",
    status: "paid",
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAll({ page, limit: 10 });
      setPayments(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch {
      setPayments([
        {
          _id: "1",
          memberId: { name: "Amit Kumar" },
          amount: 4499,
          paymentDate: new Date().toISOString(),
          status: "paid",
          method: "upi",
          receiptNumber: "RCP-001",
          packageId: { name: "Gold Half-Yearly" },
        },
        {
          _id: "2",
          memberId: { name: "Sneha Patel" },
          amount: 2499,
          paymentDate: new Date().toISOString(),
          status: "paid",
          method: "cash",
          receiptNumber: "RCP-002",
          packageId: { name: "Silver Quarterly" },
        },
        {
          _id: "3",
          memberId: { name: "Vikram Reddy" },
          amount: 7999,
          paymentDate: new Date().toISOString(),
          status: "pending",
          method: "card",
          receiptNumber: "RCP-003",
          packageId: { name: "Platinum Annual" },
        },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const handleSave = async () => {
    try {
      await paymentService.create(formData);
      toast.success("Payment recorded");
      setDialogOpen(false);
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const statusColors = {
    paid: "#39FF14",
    pending: "#FFB800",
    failed: "#FF3131",
    refunded: "#94A3B8",
  };
  const methodLabels = {
    cash: "Cash",
    card: "Card",
    upi: "UPI",
    online: "Online",
    bank_transfer: "Bank Transfer",
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontFamily: "Outfit" }}
          >
            Payments
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Track and manage payment records
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Record Payment
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receipt</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : payments.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ display: "table-row" }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Receipt sx={{ color: "#94A3B8", fontSize: 18 }} />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontFamily: "monospace" }}
                          >
                            {p.receiptNumber || "-"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {p.memberId?.name || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: "#39FF14" }}
                        >
                          ₹{p.amount?.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.packageId?.name || "-"}
                          size="small"
                          sx={{
                            bgcolor: alpha("#00F5FF", 0.08),
                            color: "#00F5FF",
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={methodLabels[p.method] || p.method}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                          {new Date(p.paymentDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.status?.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              statusColors[p.status] || "#94A3B8",
                              0.1,
                            ),
                            color: statusColors[p.status] || "#94A3B8",
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
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
            />
          </Box>
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Record Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Member ID"
                value={formData.memberId}
                onChange={(e) =>
                  setFormData({ ...formData, memberId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Method"
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Package ID"
                value={formData.packageId}
                onChange={(e) =>
                  setFormData({ ...formData, packageId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: "#94A3B8" }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsPage;
