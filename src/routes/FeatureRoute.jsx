import { useSelector } from "react-redux";
import { FEATURE_MAP } from "../config/featureConfig";
import UpgradePlanPage from "../components/UpgradePlanPage";

/**
 * Route wrapper that gates access based on subscription plan features.
 *
 * Usage:
 *   <FeatureRoute feature="vrEnabled">
 *     <GymScene />
 *   </FeatureRoute>
 *
 * If `feature` prop is omitted, it tries to auto-detect from FEATURE_MAP
 * using the current path.
 */
const FeatureRoute = ({ children, feature }) => {
  const subscription = useSelector((state) => state.auth.subscription);
  const plan = subscription?.plan || null;
  const features = plan?.features || {};

  // Determine required feature
  const requiredFeature = feature || null;

  // No feature required — always allow
  if (!requiredFeature) return children;

  // Feature is available
  if (features[requiredFeature]) return children;

  // Feature is locked — show upgrade page
  return <UpgradePlanPage featureKey={requiredFeature} planName={plan?.name} />;
};

export default FeatureRoute;
