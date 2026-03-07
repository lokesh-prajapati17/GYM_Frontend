import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SearchOff as SearchOffIcon } from "@mui/icons-material";

const EmptyState = ({
  message = "No data found",
  icon: Icon = SearchOffIcon,
  action,
  actionLabel = "Add New",
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: 64,
            color: theme.palette.text.secondary,
            opacity: 0.4,
          }}
        />
      )}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
      {action && (
        <Button variant="outlined" onClick={action} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
