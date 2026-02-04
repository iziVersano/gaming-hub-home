// Feature Flags Configuration
// Toggle features on/off without code changes

export const featureFlags = {
  // Hero Section Features
  HERO_NEW_ARRIVALS_SPOTLIGHT: true,  // Rotating product spotlight in hero section
  HERO_GRADIENT_BACKGROUND: false,  // Show gradient background in hero section

  // Future flags can be added here
  // HERO_VIDEO_BACKGROUND: false,
  // PRODUCTS_QUICK_VIEW: false,
} as const;

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (flag: keyof typeof featureFlags): boolean => {
  return featureFlags[flag] ?? false;
};
