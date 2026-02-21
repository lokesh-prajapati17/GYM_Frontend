import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  Typography,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";
import { Close, FitnessCenter } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  selectThemeColors,
  selectBrightness,
} from "../../features/vr/vrThemeSlice";
import { floorService } from "../../services/services";
import PanoramaViewer from "./PanoramaViewer";
import HotspotMarker from "./HotspotMarker";
import FloorSelector from "./FloorSelector";
import VRThemePanel from "./VRThemePanel";
import toast from "react-hot-toast";

/**
 * GymScene — Main orchestrator for the multi-floor 360° VR experience.
 * Fetches floors from API, handles floor switching, renders panorama + hotspots.
 */
const GymScene = () => {
  const colors = useSelector(selectThemeColors);
  const brightness = useSelector(selectBrightness);
  const [floors, setFloors] = useState([]);
  const [activeFloor, setActiveFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Fetch floors from backend
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const res = await floorService.getAll();
        setFloors(res.data.data);
        if (res.data.data.length > 0) {
          setActiveFloor(res.data.data[0]);
        }
      } catch {
        // Demo fallback data when no floors uploaded
        const demoFloors = [
          {
            _id: "demo1",
            name: "Floor 1 — Cardio Zone",
            slug: "floor1",
            order: 1,
            panoramaImage: "",
            previewImage: "",
            description:
              "Treadmills, ellipticals, cycling stations, and rowing machines",
            hotspots: [
              {
                x: 5,
                y: 0,
                z: -8,
                type: "equipment",
                label: "Treadmills",
                description:
                  "6x Commercial treadmills with incline. Speed up to 20km/h.",
                icon: "fitness_center",
              },
              {
                x: -6,
                y: 0.5,
                z: -5,
                type: "equipment",
                label: "Cycling Station",
                description: "4x Spin bikes with magnetic resistance.",
                icon: "fitness_center",
              },
              {
                x: 8,
                y: 0,
                z: 3,
                type: "info",
                label: "Water Station",
                description: "Filtered cold water. Towel station nearby.",
                icon: "info",
              },
            ],
          },
          {
            _id: "demo2",
            name: "Floor 2 — Strength Zone",
            slug: "floor2",
            order: 2,
            panoramaImage: "",
            previewImage: "",
            description:
              "Free weights, squat racks, bench press, cable machines",
            hotspots: [
              {
                x: 0,
                y: 0.5,
                z: -7,
                type: "equipment",
                label: "Squat Racks",
                description: "4x Power cage with safety bars and pull-up bars.",
                icon: "fitness_center",
              },
              {
                x: -7,
                y: 0,
                z: 0,
                type: "equipment",
                label: "Dumbbell Rack",
                description: "Complete range: 2.5kg to 50kg pairs.",
                icon: "fitness_center",
              },
              {
                x: 6,
                y: 1,
                z: -4,
                type: "equipment",
                label: "Cable Machine",
                description: "Dual adjustable pulley system.",
                icon: "fitness_center",
              },
              {
                x: -3,
                y: 0,
                z: 6,
                type: "navigation",
                label: "→ Floor 3",
                description: "Navigate to Yoga & Recovery zone.",
                icon: "navigation",
              },
            ],
          },
          {
            _id: "demo3",
            name: "Floor 3 — Yoga & Recovery",
            slug: "floor3",
            order: 3,
            panoramaImage: "",
            previewImage: "",
            description: "Yoga studio, stretching area, sauna, and steam room",
            hotspots: [
              {
                x: 0,
                y: 0,
                z: -6,
                type: "equipment",
                label: "Yoga Studio",
                description:
                  "Heated yoga studio with mirrors and sound system.",
                icon: "fitness_center",
              },
              {
                x: -5,
                y: 0,
                z: 4,
                type: "info",
                label: "Sauna",
                description:
                  "Finnish dry sauna. Sessions: 15-20 minutes recommended.",
                icon: "info",
              },
            ],
          },
        ];
        setFloors(demoFloors);
        setActiveFloor(demoFloors[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchFloors();
  }, []);

  const handleFloorChange = (floor) => {
    if (floor._id === activeFloor?._id) return;
    setTransitioning(true);
    // Short delay for fade effect
    setTimeout(() => {
      setActiveFloor(floor);
      setTransitioning(false);
    }, 300);
  };

  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === "navigation") {
      // Find target floor
      const targetFloor = floors.find(
        (f) =>
          f._id === hotspot.referenceId ||
          hotspot.label
            ?.toLowerCase()
            .includes(f.name?.toLowerCase()?.split(" ")[0]),
      );
      if (targetFloor) {
        handleFloorChange(targetFloor);
        return;
      }
    }
    setSelectedHotspot(hotspot);
    setDetailOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} size={48} />
      </Box>
    );
  }

  const typeColors = {
    equipment: colors.primary,
    info: colors.secondary,
    navigation: colors.accent,
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: "Outfit",
              color: colors.primary,
            }}
          >
            360° Virtual Gym
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            {activeFloor?.name || "Select a floor"} • Click hotspots for details
            • Drag to look around
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <VRThemePanel compact />
          {["equipment", "info", "navigation"].map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{
                bgcolor: alpha(typeColors[type], 0.1),
                color: typeColors[type],
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Main View */}
      <Grid container spacing={2}>
        {/* 360° Canvas */}
        <Grid item xs={12} md={9}>
          <Card
            sx={{
              overflow: "hidden",
              border: `1px solid ${alpha(colors.primary, 0.15)}`,
              position: "relative",
            }}
          >
            {/* Transition overlay */}
            {transitioning && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.8)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress sx={{ color: colors.primary }} />
              </Box>
            )}

            <Box sx={{ height: { xs: 400, md: 550 } }}>
              <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                <Suspense fallback={null}>
                  {/* Ambient lighting controlled by theme */}
                  <ambientLight
                    intensity={0.3 * brightness}
                    color={colors.ambient}
                  />
                  <pointLight
                    position={[0, 2, 0]}
                    intensity={0.2 * brightness}
                    color={colors.primary}
                    distance={10}
                  />

                  {/* 360° Panorama */}
                  <PanoramaViewer
                    imageUrl={activeFloor?.panoramaImage || null}
                    brightness={brightness}
                  />

                  {/* Hotspot markers */}
                  {activeFloor?.hotspots?.map((hs, i) => (
                    <HotspotMarker
                      key={`${activeFloor._id}-${i}`}
                      position={[hs.x, hs.y, hs.z]}
                      label={hs.label}
                      type={hs.type}
                      color={typeColors[hs.type] || colors.hotspot}
                      isHovered={hoveredHotspot === i}
                      onHoverStart={() => setHoveredHotspot(i)}
                      onHoverEnd={() => setHoveredHotspot(null)}
                      onClick={() => handleHotspotClick(hs)}
                    />
                  ))}

                  {/* Controls — inside the sphere looking out */}
                  <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={0.1}
                    maxDistance={1}
                    rotateSpeed={-0.3}
                    zoomSpeed={0.5}
                    enableDamping
                    dampingFactor={0.08}
                  />
                </Suspense>
              </Canvas>
            </Box>

            {/* Floor info bar */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: 2,
                py: 1.5,
                background: `linear-gradient(transparent, ${alpha("#0A0E17", 0.95)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: colors.primary }}
                >
                  {activeFloor?.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#94A3B8", fontSize: "0.7rem" }}
                >
                  {activeFloor?.description}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", fontSize: "0.65rem" }}
              >
                🖱 Drag to look • Scroll to zoom •{" "}
                {activeFloor?.hotspots?.length || 0} hotspots
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FloorSelector
              floors={floors}
              activeFloor={activeFloor}
              onFloorChange={handleFloorChange}
              themeColors={colors}
            />
            <VRThemePanel />
          </Box>
        </Grid>
      </Grid>

      {/* Hotspot Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FitnessCenter
            sx={{
              color: typeColors[selectedHotspot?.type] || colors.primary,
            }}
          />
          {selectedHotspot?.label}
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" onClick={() => setDetailOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedHotspot && (
            <Box>
              <Chip
                label={selectedHotspot.type?.toUpperCase()}
                size="small"
                sx={{
                  mb: 2,
                  bgcolor: alpha(
                    typeColors[selectedHotspot.type] || colors.primary,
                    0.1,
                  ),
                  color: typeColors[selectedHotspot.type] || colors.primary,
                  fontWeight: 600,
                }}
              />
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedHotspot.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, bgcolor: alpha(colors.primary, 0.05) }}>
                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                      Position
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, fontFamily: "monospace" }}
                    >
                      ({selectedHotspot.x}, {selectedHotspot.y},{" "}
                      {selectedHotspot.z})
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, bgcolor: alpha(colors.secondary, 0.05) }}>
                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                      Type
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color:
                          typeColors[selectedHotspot.type] || colors.primary,
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedHotspot.type}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GymScene;
