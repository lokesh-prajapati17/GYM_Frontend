import {
  Box,
  Card,
  Typography,
  alpha,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  Elevator,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FloorSelector — Side panel showing floor preview cards with elevator animation.
 */
const FloorSelector = ({ floors, activeFloor, onFloorChange, themeColors }) => {
  const primary = themeColors?.primary || "#39FF14";
  const activeIdx = floors.findIndex((f) => f._id === activeFloor?._id);

  const handlePrev = () => {
    if (activeIdx > 0) onFloorChange(floors[activeIdx - 1]);
  };

  const handleNext = () => {
    if (activeIdx < floors.length - 1) onFloorChange(floors[activeIdx + 1]);
  };

  if (!floors.length) {
    return (
      <Card
        sx={{
          p: 2,
          bgcolor: alpha("#111827", 0.95),
          backdropFilter: "blur(12px)",
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          No floors uploaded yet
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: alpha("#111827", 0.95),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(primary, 0.15)}`,
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
        <Elevator sx={{ color: primary, fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "#F1F5F9", flex: 1 }}
        >
          Floors
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handlePrev}
            disabled={activeIdx <= 0}
            sx={{ color: primary, "&.Mui-disabled": { color: "#334155" } }}
          >
            <KeyboardArrowUp fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleNext}
            disabled={activeIdx >= floors.length - 1}
            sx={{ color: primary, "&.Mui-disabled": { color: "#334155" } }}
          >
            <KeyboardArrowDown fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Floor Cards */}
      <Box sx={{ maxHeight: 350, overflowY: "auto", p: 1 }}>
        <AnimatePresence>
          {floors.map((floor, i) => {
            const isActive = floor._id === activeFloor?._id;
            return (
              <motion.div
                key={floor._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Box
                  onClick={() => onFloorChange(floor)}
                  sx={{
                    p: 1.5,
                    mb: 0.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: isActive ? alpha(primary, 0.1) : "transparent",
                    border: isActive
                      ? `1px solid ${alpha(primary, 0.3)}`
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(primary, 0.06),
                    },
                  }}
                >
                  {/* Preview thumbnail */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      overflow: "hidden",
                      flexShrink: 0,
                      bgcolor: alpha(primary, 0.05),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {floor.previewImage ? (
                      <img
                        src={floor.previewImage}
                        alt={floor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          color: primary,
                        }}
                      >
                        {i + 1}
                      </Typography>
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? primary : "#CBD5E1",
                        fontSize: "0.8rem",
                      }}
                    >
                      {floor.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", fontSize: "0.65rem" }}
                    >
                      {floor.hotspots?.length || 0} hotspots
                    </Typography>
                  </Box>

                  {/* Active indicator */}
                  {isActive && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: primary,
                        boxShadow: `0 0 8px ${primary}`,
                      }}
                    />
                  )}
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      {/* Elevator indicator bar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: `1px solid ${alpha("#94A3B8", 0.08)}`,
          display: "flex",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        {floors.map((f, i) => (
          <Box
            key={f._id}
            onClick={() => onFloorChange(f)}
            sx={{
              width: f._id === activeFloor?._id ? 20 : 8,
              height: 4,
              borderRadius: 4,
              bgcolor:
                f._id === activeFloor?._id ? primary : alpha("#94A3B8", 0.2),
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Card>
  );
};

export default FloorSelector;
