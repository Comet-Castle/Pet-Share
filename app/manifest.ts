import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pet Share",
    short_name: "Pet Share",
    description: "Test-drive a pet. Commitment sold separately.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/icon.png",
        sizes: "80x80",
        type: "image/png"
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
