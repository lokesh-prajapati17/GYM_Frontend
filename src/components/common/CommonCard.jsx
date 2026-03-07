import React from "react";
import { Card, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CommonCard = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  noPadding = false,
  sx = {},
}) => {
  const theme = useTheme();
  const hasHeader = title || actions;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        ...sx,
      }}
    >
      {hasHeader && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {Icon && (
              <Icon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 28,
                }}
              />
            )}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mt: 0.25,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
        </Box>
      )}
      <Box sx={noPadding ? {} : { p: 0 }}>{children}</Box>
    </Card>
  );
};

export default CommonCard;
