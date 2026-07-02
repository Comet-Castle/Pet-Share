export type VisualStringOption = Readonly<{
  title: string;
  value: string;
  description?: string;
  color?: string;
  background?: string;
  border?: string;
}>;

export const processToneOptions = [
  {
    title: "Owner / sharing",
    value: "owner",
    description: "Mint section background for people listing their pet.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  },
  {
    title: "Host / temporary stay",
    value: "host",
    description: "Blue section background for people hosting a temporary pet.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  },
  {
    title: "Neutral",
    value: "neutral",
    description: "Soft white section background for general process content.",
    color: "#26343b",
    background: "#ffffff",
    border: "#efe7dc"
  }
] satisfies VisualStringOption[];

export const ctaStyleOptions = [
  {
    title: "Primary",
    value: "primary",
    description: "Coral filled pill button for the main action.",
    color: "#ffffff",
    background: "#ff8b6d",
    border: "#ff8b6d"
  },
  {
    title: "Secondary",
    value: "secondary",
    description: "White pill button for supporting actions.",
    color: "#26343b",
    background: "#ffffff",
    border: "#efe7dc"
  },
  {
    title: "Text",
    value: "text",
    description: "Inline underlined link for quiet actions.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#ffb49f"
  }
] satisfies VisualStringOption[];

export const alignmentOptions = [
  {
    title: "Left",
    value: "left",
    description: "Align content to the left edge of the section.",
    color: "#26343b",
    background: "#ffffff",
    border: "#efe7dc"
  },
  {
    title: "Center",
    value: "center",
    description: "Center content for balanced marketing sections.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#ffb49f"
  },
  {
    title: "Right",
    value: "right",
    description: "Align content to the right when the layout supports it.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  }
] satisfies VisualStringOption[];

export const heroLayoutOptions = [
  {
    title: "Media card",
    value: "mediaCard",
    description: "Text paired with a large image card for visual pages.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  },
  {
    title: "Centered",
    value: "centered",
    description: "Text-first centered hero with no required image.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#ffb49f"
  }
] satisfies VisualStringOption[];

export const contentLayoutOptions = [
  {
    title: "Text only",
    value: "textOnly",
    description: "A focused copy section without media.",
    color: "#26343b",
    background: "#ffffff",
    border: "#efe7dc"
  },
  {
    title: "Media left",
    value: "mediaLeft",
    description: "Image appears before the text on wide screens.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  },
  {
    title: "Media right",
    value: "mediaRight",
    description: "Image appears after the text on wide screens.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  }
] satisfies VisualStringOption[];

export const calloutToneOptions = [
  {
    title: "Playful",
    value: "playful",
    description: "Light satirical emphasis for fun asides.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#ffb49f"
  },
  {
    title: "Friendly",
    value: "friendly",
    description: "Warm practical emphasis for helpful notes.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  },
  {
    title: "Calm",
    value: "calm",
    description: "Quiet emphasis for straightforward guidance.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  }
] satisfies VisualStringOption[];

export const featureIconStyleOptions = [
  {
    title: "Outline",
    value: "outline",
    description: "White icon badges with a mint outline.",
    color: "#26343b",
    background: "#ffffff",
    border: "#a9dfca"
  },
  {
    title: "Filled badge",
    value: "filledBadge",
    description: "Soft filled icon badges for a stronger card treatment.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#ffb49f"
  }
] satisfies VisualStringOption[];
