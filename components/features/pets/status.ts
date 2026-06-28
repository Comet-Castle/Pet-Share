export const availabilityLabels = {
  available: "Available",
  pendingPickup: "Pending pickup",
  retired: "Retired",
  temporarilyUnavailable: "Taking a nap"
} as const;

export const temperamentLabels = {
  dramatic: "Dramatic",
  friendly: "Friendly",
  independent: "Independent",
  regal: "Regal",
  suspicious: "Suspicious"
} as const;

export const urgencyLabels = {
  anytime: "Anytime",
  appointmentOnly: "Appointment only",
  immediately: "Immediately",
  withinSevenDays: "Within seven days"
} as const;

export const cuddlePolicyLabels = {
  afterSnacksOnly: "After snacks only",
  consentRequired: "Consent required",
  lookDoNotCuddle: "Look, do not cuddle",
  openEnrollment: "Open enrollment"
} as const;
