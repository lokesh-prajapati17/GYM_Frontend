import { useSelector } from "react-redux";

/**
 * Custom hook to access subscription data and feature checks from Redux state.
 *
 * Usage:
 *   const { hasFeature, plan, isActive } = useSubscription();
 *   if (hasFeature("vrEnabled")) { ... }
 */
const useSubscription = () => {
    const subscription = useSelector((state) => state.auth.subscription);

    const plan = subscription?.plan || null;
    const features = plan?.features || {};
    const subscriptionStatus = subscription?.status || null;
    const isActive = subscriptionStatus === "active";

    /**
     * Check if a specific feature is enabled in the current plan.
     * @param {string} featureName – key from SubscriptionPlan.features
     * @returns {boolean}
     */
    const hasFeature = (featureName) => {
        if (!featureName) return true; // No feature required = always allowed
        return Boolean(features[featureName]);
    };

    return {
        subscription,
        plan,
        features,
        subscriptionStatus,
        isActive,
        hasFeature,
    };
};

export default useSubscription;
