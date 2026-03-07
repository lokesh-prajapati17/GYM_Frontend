import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Add, Receipt } from "@mui/icons-material";
import { paymentService } from "../services/paymentService";
import { memberService } from "../../members/services/memberService";
import { membershipService } from "../../membership/services/membershipService";
import { branchService } from "../../branches/services/branchService";
import { useSelector } from "react-redux";
import { Store as BranchIcon } from "@mui/icons-material";
import { CommonCard, CommonTable, FilterBar } from "../../../components/common";

const RecordPaymentModal = lazy(
  () => import("../components/RecordPaymentModal"),
);

const PaymentsPage = () => {
  const theme = useTheme();

  // MAIN DATA STATE
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // PAGINATION (state for UI)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FILTER & PAGINATION (useRef)
  const filterRef = useRef({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    branchId: "",
    from: "",
    to: "",
  });

  // META DATA
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [branches, setBranches] = useState([]);

  // MODAL MANAGEMENT
  const [modalType, setModalType] = useState("");

  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner" || user?.role === "admin";
  const userBranchId = !isOwner
    ? user?.defaultBranchId || user?.branchAccess?.[0]
    : null;

  // API FETCHING
  const getData = async () => {
    try {
      setIsLoading(true);
      const params = { ...filterRef.current };

      if (!isOwner && userBranchId) {
        params.branchId = userBranchId;
      }

      const res = await paymentService.getAll(params);

      if (res?.data?.success || res?.data) {
        setData(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.pages || 1);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [membersRes, packagesRes, branchesRes] = await Promise.all([
        memberService.getAll({ limit: 1000 }),
        membershipService.getAll(),
        branchService.getBranches(),
      ]);
      setMembers(membersRes.data.data || []);
      setPackages(packagesRes.data.data || []);
      setBranches(branchesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    }
  };

  useEffect(() => {
    fetchMetadata();
    getData();
  }, []);

  // FILTER HANDLERS
  const handleSearch = (value) => {
    filterRef.current.search = value;
    filterRef.current.page = 1;
    setCurrentPage(1);
    getData();
  };

  const handleFilterChange = (key, value) => {
    filterRef.current[key] = value;
    filterRef.current.page = 1;
    setCurrentPage(1);
    getData();
  };

  const handlePageChange = (page) => {
    filterRef.current.page = page;
    setCurrentPage(page);
    getData();
  };

  const handleResetFilters = () => {
    filterRef.current = {
      page: 1,
      limit: 10,
      search: "",
      status: "",
      branchId: "",
      from: "",
      to: "",
    };
    setCurrentPage(1);
    getData();
  };

  // STATUS & METHOD MAPS
  const statusColors = {
    paid: theme.palette.success.main,
    pending: theme.palette.warning.main,
    failed: theme.palette.error.main,
    refunded: theme.palette.text.secondary,
  };

  const methodLabels = {
    cash: "Cash",
    card: "Card",
    upi: "UPI",
    online: "Online",
    bank_transfer: "Bank Transfer",
  };

  const showBranchFilter = isOwner && branches.length > 1;

  // FILTER CONFIG
  const filterConfig = [
    {
      key: "status",
      label: "Status",
      defaultValue: "",
      onChange: (val) => handleFilterChange("status", val),
      options: [
        { value: "", label: "All Statuses" },
        { value: "paid", label: "Paid" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    ...(showBranchFilter
      ? [
          {
            key: "branchId",
            label: "Branch",
            defaultValue: "",
            icon: BranchIcon,
            onChange: (val) => handleFilterChange("branchId", val),
            options: [
              { value: "", label: "All Branches" },
              ...branches.map((b) => ({ value: b._id, label: b.name })),
            ],
          },
        ]
      : []),
  ];

  const dateFilterConfig = [
    {
      key: "from",
      label: "From Date",
      onChange: (val) => handleFilterChange("from", val),
    },
    {
      key: "to",
      label: "To Date",
      onChange: (val) => handleFilterChange("to", val),
    },
  ];

  // TABLE COLUMNS
  const columns = [
    {
      key: "receiptNumber",
      label: "Receipt",
      render: (p) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Receipt sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontFamily: "monospace" }}
          >
            {p.receiptNumber || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      key: "member",
      label: "Member",
      render: (p) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {p.memberId?.name || "-"}
        </Typography>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (p) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: theme.palette.success.main }}
        >
          ₹{p.amount?.toLocaleString()}
        </Typography>
      ),
    },
    {
      key: "package",
      label: "Package",
      render: (p) => (
        <Chip
          label={p.packageId?.name || "-"}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.info.main, 0.08),
            color: theme.palette.info.main,
            fontSize: "0.7rem",
          }}
        />
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (p) => (
        <Chip
          label={methodLabels[p.method] || p.method}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.7rem" }}
        />
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (p) => (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {new Date(p.paymentDate || p.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (p) => (
        <Chip
          label={p.status?.toUpperCase()}
          size="small"
          sx={{
            bgcolor: alpha(
              statusColors[p.status] || theme.palette.text.secondary,
              0.1,
            ),
            color: statusColors[p.status] || theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      ),
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Payments
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Track and manage payment records and revenue
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setModalType("add")}
        >
          Record Payment
        </Button>
      </Box>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search receipts or members..."
        onSearchChange={handleSearch}
        filters={filterConfig}
        dateFilters={dateFilterConfig}
        onReset={handleResetFilters}
      />

      {/* Payments Table */}
      <CommonCard>
        <CommonTable
          columns={columns}
          data={data}
          loading={isLoading}
          emptyMessage="No payments found matching the selected criteria."
          emptyIcon={Receipt}
          pagination={{ page: currentPage, pages: totalPages }}
          onPageChange={handlePageChange}
        />
      </CommonCard>

      {/* Lazy Loaded Modal */}
      <Suspense fallback={null}>
        <RecordPaymentModal
          open={modalType === "add"}
          onClose={() => setModalType("")}
          onRefresh={getData}
          members={members}
          packages={packages}
        />
      </Suspense>
    </Box>
  );
};

export default PaymentsPage;
