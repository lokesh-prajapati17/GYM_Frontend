import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FormGrid = ({
  children,
  columns = 2,
  spacing = 2.5,
  sectionTitle,
  sx = {},
}) => {
  const theme = useTheme();
  const childArray = React.Children.toArray(children);

  return (
    <Box sx={sx}>
      {sectionTitle && (
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            mb: 1.5,
            mt: 1,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
          }}
        >
          {sectionTitle}
        </Typography>
      )}
      <Grid container spacing={spacing}>
        {childArray.map((child, index) => (
          <Grid
            item
            xs={12}
            sm={columns === 1 ? 12 : 6}
            md={12 / columns}
            key={index}
          >
            {child}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FormGrid;
