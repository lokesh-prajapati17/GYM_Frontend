import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  alpha,
  Slider,
} from "@mui/material";
import { FitnessCenter } from "@mui/icons-material";
import { motion } from "framer-motion";

const getBMICategory = (bmi) => {
  if (bmi < 18.5)
    return {
      label: "Underweight",
      color: "#00F5FF",
      advice: "Consider increasing your calorie intake with nutritious foods.",
    };
  if (bmi < 25)
    return {
      label: "Normal",
      color: "#39FF14",
      advice: "Great job! Maintain your current healthy lifestyle.",
    };
  if (bmi < 30)
    return {
      label: "Overweight",
      color: "#FFB800",
      advice: "Consider regular exercise and a balanced diet.",
    };
  return {
    label: "Obese",
    color: "#FF3131",
    advice: "Consult a healthcare provider for personalized guidance.",
  };
};

const BMIPage = () => {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    const heightM = height / 100;
    const bmi = +(weight / (heightM * heightM)).toFixed(1);
    setResult({ bmi, ...getBMICategory(bmi) });
  };

  // Gauge position (BMI 15-40)
  const gaugePercent = result
    ? Math.min(100, Math.max(0, ((result.bmi - 15) / 25) * 100))
    : 0;

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, fontFamily: "Outfit", mb: 0.5 }}
      >
        BMI Calculator
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mb: 3 }}>
        Calculate your Body Mass Index
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "#94A3B8" }}>
                Height: {height} cm
              </Typography>
              <Slider
                value={height}
                onChange={(_, v) => setHeight(v)}
                min={100}
                max={250}
                step={1}
                sx={{
                  color: "#39FF14",
                  "& .MuiSlider-thumb": {
                    boxShadow: `0 0 10px ${alpha("#39FF14", 0.5)}`,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "#94A3B8" }}>
                Weight: {weight} kg
              </Typography>
              <Slider
                value={weight}
                onChange={(_, v) => setWeight(v)}
                min={30}
                max={200}
                step={0.5}
                sx={{
                  color: "#FF6B35",
                  "& .MuiSlider-thumb": {
                    boxShadow: `0 0 10px ${alpha("#FF6B35", 0.5)}`,
                  },
                }}
              />
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={height}
                  size="small"
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  size="small"
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={calculateBMI}
              sx={{ py: 1.5, fontWeight: 700, fontSize: "1rem" }}
            >
              Calculate BMI
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card sx={{ p: 4, textAlign: "center" }}>
                <FitnessCenter
                  sx={{ fontSize: 48, color: result.color, mb: 2 }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "Outfit",
                    color: result.color,
                    mb: 1,
                  }}
                >
                  {result.bmi}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: result.color, mb: 3 }}
                >
                  {result.label}
                </Typography>

                {/* BMI Gauge */}
                <Box
                  sx={{
                    position: "relative",
                    height: 32,
                    borderRadius: 4,
                    overflow: "hidden",
                    mb: 2,
                    background:
                      "linear-gradient(90deg, #00F5FF 0%, #39FF14 33%, #FFB800 66%, #FF3131 100%)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      left: `${gaugePercent}%`,
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 40,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                    px: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#00F5FF" }}>
                    15
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#39FF14" }}>
                    18.5
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#FFB800" }}>
                    25
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#FF3131" }}>
                    30
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#FF3131" }}>
                    40
                  </Typography>
                </Box>

                <Card
                  sx={{
                    bgcolor: alpha(result.color, 0.05),
                    border: `1px solid ${alpha(result.color, 0.2)}`,
                    p: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
                    {result.advice}
                  </Typography>
                </Card>

                {/* Categories */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  {[
                    { label: "Underweight", range: "< 18.5", color: "#00F5FF" },
                    { label: "Normal", range: "18.5 - 24.9", color: "#39FF14" },
                    {
                      label: "Overweight",
                      range: "25 - 29.9",
                      color: "#FFB800",
                    },
                    { label: "Obese", range: "≥ 30", color: "#FF3131" },
                  ].map((cat) => (
                    <Grid item xs={6} sm={3} key={cat.label}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor:
                            result.label === cat.label
                              ? alpha(cat.color, 0.1)
                              : "transparent",
                          border:
                            result.label === cat.label
                              ? `1px solid ${alpha(cat.color, 0.3)}`
                              : "1px solid transparent",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: cat.color,
                            mx: "auto",
                            mb: 0.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: cat.color,
                            display: "block",
                          }}
                        >
                          {cat.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {cat.range}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </motion.div>
          ) : (
            <Card
              sx={{
                p: 6,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitnessCenter
                sx={{ fontSize: 64, color: "#94A3B8", opacity: 0.3, mb: 2 }}
              />
              <Typography variant="h6" sx={{ color: "#64748B" }}>
                Enter your height and weight
              </Typography>
              <Typography variant="body2" sx={{ color: "#475569" }}>
                Click "Calculate BMI" to see your results
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BMIPage;
