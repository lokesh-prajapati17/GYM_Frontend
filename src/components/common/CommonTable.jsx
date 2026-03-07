import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./PageLoader";
import EmptyState from "./EmptyState";
import PaginationComponent from "./PaginationComponent";

const CommonTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data found",
  emptyIcon,
  pagination,
  onPageChange,
  rowKey = "_id",
  animated = true,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box sx={sx}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              }}
            >
              {columns.map((col, i) => (
                <TableCell
                  key={col.key || i}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    ...col.headerSx,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                  <PageLoader />
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              <AnimatePresence>
                {data.map((row, index) => {
                  const key =
                    typeof rowKey === "function" ? rowKey(row) : row[rowKey];
                  const RowWrapper = animated ? motion.tr : "tr";
                  const motionProps = animated
                    ? {
                        initial: { opacity: 0, y: 8 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0 },
                        transition: { delay: index * 0.03, duration: 0.25 },
                        style: { display: "table-row" },
                      }
                    : {};

                  return (
                    <RowWrapper key={key || index} {...motionProps}>
                      {columns.map((col, colIndex) => (
                        <TableCell
                          key={col.key || colIndex}
                          align={col.align || "left"}
                          sx={{
                            color: theme.palette.text.primary,
                            ...col.cellSx,
                          }}
                        >
                          {col.render
                            ? col.render(row, index)
                            : (row[col.key] ?? "-")}
                        </TableCell>
                      ))}
                    </RowWrapper>
                  );
                })}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                  <EmptyState message={emptyMessage} icon={emptyIcon} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && onPageChange && (
        <PaginationComponent
          page={pagination.page}
          pages={pagination.pages}
          onChange={onPageChange}
        />
      )}
    </Box>
  );
};

export default CommonTable;
