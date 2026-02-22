import React from "react";
import { Box, Typography, Button, alpha, keyframes } from "@mui/material";
import {
  Lock as LockIcon,
  RocketLaunch as RocketIcon,
} from "@mui/icons-material";
import { FEATURE_LABELS, FEATURE_DESCRIPTIONS } from "../config/featureConfig";

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(57, 255, 20, 0.2), 0 0 60px rgba(57, 255, 20, 0.05); }
  50% { box-shadow: 0 0 40px rgba(57, 255, 20, 0.35), 0 0 80px rgba(57, 255, 20, 0.12); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

/**
 * Premium "Feature Locked" page shown when a user navigates to a
 * route that requires a subscription feature they don't have.
 */
const UpgradePlanPage = ({ featureKey, planName }) => {
  const label = FEATURE_LABELS[featureKey] || featureKey;
  const description =
    FEATURE_DESCRIPTIONS[featureKey] ||
    "This feature is not included in your current plan.";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
        px: 3,
      }}
    >
      {/* Glowing lock icon */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${alpha("#39FF14", 0.12)} 0%, ${alpha("#00E676", 0.06)} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          animation: `${pulseGlow} 3s ease-in-out infinite, ${floatAnimation} 4s ease-in-out infinite`,
          border: `2px solid ${alpha("#39FF14", 0.2)}`,
        }}
      >
        <LockIcon sx={{ fontSize: 52, color: "#39FF14" }} />
      </Box>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 800,
          color: "#F1F5F9",
          mb: 1.5,
          letterSpacing: "-0.02em",
        }}
      >
        {label}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          color: alpha("#94A3B8", 0.9),
          mb: 2,
        }}
      >
        Premium Feature
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: "#94A3B8",
          maxWidth: 480,
          lineHeight: 1.7,
          mb: 4,
          fontSize: "1rem",
        }}
      >
        {description}
      </Typography>

      {/* Current plan badge */}
      {planName && (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2.5,
            py: 1,
            borderRadius: 3,
            bgcolor: alpha("#FF6B35", 0.1),
            border: `1px solid ${alpha("#FF6B35", 0.25)}`,
            mb: 4,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#FF6B35", fontWeight: 600 }}
          >
            Current Plan:&nbsp;
            <span style={{ fontWeight: 800, textTransform: "uppercase" }}>
              {planName}
            </span>
          </Typography>
        </Box>
      )}

      {/* CTA Button */}
      <Button
        variant="contained"
        startIcon={<RocketIcon />}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 3,
          fontWeight: 700,
          fontSize: "0.95rem",
          textTransform: "none",
          background: "linear-gradient(135deg, #39FF14 0%, #00E676 100%)",
          color: "#0A0A0A",
          boxShadow: `0 4px 24px ${alpha("#39FF14", 0.3)}`,
          "&:hover": {
            background: "linear-gradient(135deg, #2ECC0F 0%, #00C853 100%)",
            boxShadow: `0 6px 32px ${alpha("#39FF14", 0.45)}`,
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Contact Admin to Upgrade
      </Button>

      {/* Subtle hint */}
      <Typography
        variant="caption"
        sx={{ color: alpha("#94A3B8", 0.5), mt: 2 }}
      >
        Upgrade your subscription plan to unlock this feature
      </Typography>
    </Box>
  );
};

export default UpgradePlanPage;
