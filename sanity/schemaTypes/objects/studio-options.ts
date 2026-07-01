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
