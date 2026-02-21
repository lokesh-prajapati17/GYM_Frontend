import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Slider,
  alpha,
  Tooltip,
} from "@mui/material";
import { Palette, RestartAlt, Brightness6 } from "@mui/icons-material";
import {
  setTheme,
  setBrightness,
  resetTheme,
  selectThemeColors,
  selectActiveTheme,
  selectBrightness,
  selectPresets,
} from "../../features/vr/vrThemeSlice";

/**
 * VRThemePanel — Global theme selector with 4 presets + brightness control.
 * Colors apply across the ENTIRE application, not just VR.
 */
const VRThemePanel = ({ compact = false }) => {
  const dispatch = useDispatch();
  const colors = useSelector(selectThemeColors);
  const activeTheme = useSelector(selectActiveTheme);
  const brightness = useSelector(selectBrightness);
  const presets = useSelector(selectPresets);

  const themeList = Object.entries(presets).map(([key, preset]) => ({
    key,
    ...preset,
  }));

  if (compact) {
    return (
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
        {themeList.map((t) => (
          <Tooltip key={t.key} title={t.name}>
            <Box
              onClick={() => dispatch(setTheme(t.key))}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: t.primary,
                cursor: "pointer",
                border:
                  activeTheme === t.key
                    ? "2px solid #fff"
                    : "2px solid transparent",
                boxShadow:
                  activeTheme === t.key ? `0 0 8px ${t.primary}` : "none",
                transition: "all 0.2s ease",
                "&:hover": { transform: "scale(1.2)" },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: alpha("#111827", 0.95),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(colors.primary, 0.15)}`,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: `1px solid ${alpha("#94A3B8", 0.08)}`,
        }}
      >
        <Palette sx={{ color: colors.primary, fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "#F1F5F9", flex: 1 }}
        >
          Theme
        </Typography>
        <Tooltip title="Reset to Neon">
          <IconButton
            size="small"
            onClick={() => dispatch(resetTheme())}
            sx={{ color: "#94A3B8" }}
          >
            <RestartAlt fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Preset Swatches */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "#64748B", fontWeight: 600, mb: 1, display: "block" }}
        >
          COLOR THEME
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          {themeList.map((t) => (
            <Box
              key={t.key}
              onClick={() => dispatch(setTheme(t.key))}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  activeTheme === t.key
                    ? alpha(t.primary, 0.1)
                    : alpha("#94A3B8", 0.03),
                border:
                  activeTheme === t.key
                    ? `1px solid ${alpha(t.primary, 0.4)}`
                    : `1px solid ${alpha("#94A3B8", 0.08)}`,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(t.primary, 0.08),
                  borderColor: alpha(t.primary, 0.25),
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: t.primary,
                  }}
                />
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: t.secondary,
                  }}
                />
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: t.accent,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: activeTheme === t.key ? t.primary : "#94A3B8",
                  fontSize: "0.7rem",
                }}
              >
                {t.name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Brightness */}
        <Box sx={{ mt: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Brightness6 sx={{ color: "#94A3B8", fontSize: 16 }} />
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 600 }}
            >
              BRIGHTNESS
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colors.primary, ml: "auto", fontWeight: 700 }}
            >
              {Math.round(brightness * 100)}%
            </Typography>
          </Box>
          <Slider
            value={brightness}
            onChange={(_, v) => dispatch(setBrightness(v))}
            min={0.3}
            max={2.0}
            step={0.1}
            size="small"
            sx={{
              color: colors.primary,
              "& .MuiSlider-thumb": {
                boxShadow: `0 0 8px ${alpha(colors.primary, 0.5)}`,
              },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default VRThemePanel;
