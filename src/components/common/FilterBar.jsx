import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";
import CommonCard from "./CommonCard";

const FilterBar = ({
  searchPlaceholder = "Search...",
  searchDefault = "",
  onSearchChange,
  filters = [],
  dateFilters = [],
  onReset,
  sx = {},
}) => {
  const theme = useTheme();
  const [localSearch, setLocalSearch] = useState(searchDefault);
  const [localFilters, setLocalFilters] = useState(
    filters.reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue || "" }), {}),
  );
  const [localDates, setLocalDates] = useState(
    dateFilters.reduce(
      (acc, f) => ({ ...acc, [f.key]: f.defaultValue || "" }),
      {},
    ),
  );

  const totalItems =
    (onSearchChange ? 1 : 0) +
    filters.length +
    dateFilters.length +
    (onReset ? 1 : 0);

  const getColumnWidth = () => {
    if (totalItems <= 3) return 4;
    if (totalItems <= 5) return 3;
    return 2;
  };

  const colWidth = getColumnWidth();

  const handleReset = () => {
    setLocalSearch("");
    setLocalFilters(
      filters.reduce(
        (acc, f) => ({ ...acc, [f.key]: f.defaultValue || "" }),
        {},
      ),
    );
    setLocalDates(
      dateFilters.reduce(
        (acc, f) => ({ ...acc, [f.key]: f.defaultValue || "" }),
        {},
      ),
    );
    onReset?.();
  };

  return (
    <CommonCard sx={{ mb: 3, ...sx }}>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {onSearchChange && (
            <Grid item xs={12} md={colWidth}>
              <TextField
                fullWidth
                size="small"
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}

          {dateFilters.map((df) => (
            <Grid item xs={6} md={colWidth} key={df.key}>
              <TextField
                fullWidth
                type="date"
                size="small"
                label={df.label}
                InputLabelProps={{ shrink: true }}
                value={localDates[df.key] || ""}
                onChange={(e) => {
                  setLocalDates((prev) => ({
                    ...prev,
                    [df.key]: e.target.value,
                  }));
                  df.onChange(e.target.value);
                }}
              />
            </Grid>
          ))}

          {filters.map((filter) => (
            <Grid item xs={12} md={colWidth} key={filter.key}>
              <TextField
                fullWidth
                select
                size="small"
                label={filter.label}
                value={localFilters[filter.key] ?? ""}
                onChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }));
                  filter.onChange(e.target.value);
                }}
                InputProps={
                  filter.icon
                    ? {
                        startAdornment: (
                          <filter.icon
                            sx={{
                              color: theme.palette.text.secondary,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                        ),
                      }
                    : undefined
                }
              >
                {filter.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          {onReset && (
            <Grid item xs={12} md={colWidth}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ResetIcon />}
                onClick={handleReset}
                size="medium"
                sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  textTransform: "none",
                  height: 40,
                }}
              >
                Reset
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </CommonCard>
  );
};

export default FilterBar;
