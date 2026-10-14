import type { MetadataRoute } from "next"
import { MODULES } from "@/lib/modules"
import { siteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => new URL(p, siteUrl()).toString()
  return [
    { url: u("/"), priority: 1 }, { url: u("/modules"), priority: 0.9 },
    ...MODULES.map((m) => ({ url: u(`/m/${m.code.toLowerCase()}`), priority: 0.7 })),
  ]
}
