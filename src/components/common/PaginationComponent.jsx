import React from "react";
import { Box, Pagination } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

const PaginationComponent = ({ page, pages, onChange }) => {
  const theme = useTheme();

  if (!pages || pages <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Pagination
        count={pages}
        page={page}
        onChange={(_, value) => onChange(value)}
        sx={{
          "& .MuiPaginationItem-root": {
            color: theme.palette.text.secondary,
            fontWeight: 500,
          },
          "& .Mui-selected": {
            bgcolor: `${alpha(theme.palette.primary.main, 0.15)} !important`,
            color: `${theme.palette.primary.main} !important`,
            fontWeight: 700,
          },
          "& .MuiPaginationItem-root:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      />
    </Box>
  );
};

export default PaginationComponent;
