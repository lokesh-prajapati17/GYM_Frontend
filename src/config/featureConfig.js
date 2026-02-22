/**
 * Feature Config – Maps routes/sidebar items to subscription plan features.
 *
 * Keys   = route path (must match sidebar item `path` and <Route path="">)
 * Values = feature key inside SubscriptionPlan.features
 *
 * Routes NOT listed here are considered "core" and always accessible.
 */

export const FEATURE_MAP = {
    "/gym-view": "vrEnabled",
    "/floor-management": "multiCitySupport",
    // Add future feature-gated routes here, e.g.:
    // "/analytics": "analyticsAdvanced",
    // "/public-website": "publicWebsite",
    // "/qr-checkin": "qrCheckIn",
};

/**
 * Human-readable labels for each feature (used in the Upgrade page & badges).
 */
export const FEATURE_LABELS = {
    vrEnabled: "3D / VR Gym View",
    analyticsAdvanced: "Advanced Analytics",
    qrCheckIn: "QR Check-In",
    multiCitySupport: "Multi-City / Floor Management",
    publicWebsite: "Public Website Builder",
};

/**
 * Descriptions shown on the Upgrade page when a feature is locked.
 */
export const FEATURE_DESCRIPTIONS = {
    vrEnabled:
        "Experience an immersive 3D walkthrough of your gym floor layout with interactive equipment placement.",
    analyticsAdvanced:
        "Unlock deep insights with advanced dashboards, member retention graphs, and revenue forecasts.",
    qrCheckIn:
        "Enable contactless member check-in with auto-generated QR codes at your gym entrance.",
    multiCitySupport:
        "Manage multiple floors and branches across cities from a single dashboard.",
    publicWebsite:
        "Auto-generate a beautiful public-facing website for your gym with online registration.",
};
