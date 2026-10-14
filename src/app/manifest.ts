import type { MetadataRoute } from "next"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"

// Installable on phones, tablets and desktops (DP-06 mobile-first for the field).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GD Prime HRM Platform", short_name: SITE_NAME, description: SITE_DESCRIPTION, start_url: "/", scope: "/",
    display: "standalone", orientation: "any", background_color: "#0a1f5c", theme_color: "#0a1f5c",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/gppmc-logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
