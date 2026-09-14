export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    dynamicLimit: 3, // trial allowance so the product can be felt before paying
    analytics: true,
    smartRules: false,
  },
  creator: {
    name: "Creator",
    price: 199,
    dynamicLimit: 25,
    analytics: true,
    smartRules: false,
  },
  business: {
    name: "Business",
    price: 699,
    dynamicLimit: 250,
    analytics: true,
    smartRules: true,
  },
  agency: {
    name: "Agency",
    price: 1999,
    dynamicLimit: 2000,
    analytics: true,
    smartRules: true,
  },
};

export function planFor(workspace) {
  return PLANS[workspace?.plan] ?? PLANS.free;
}
