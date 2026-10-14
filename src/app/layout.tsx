import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Manrope, Playfair_Display } from "next/font/google"
import { AppShell, type NavGroup } from "@/components/app-shell"
import { GROUPS, moduleByCode } from "@/lib/modules"
import { parseTheme, THEME_COOKIE } from "@/lib/theme"
import { getViewer } from "@/lib/viewer"
import { fullName } from "@/lib/data"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, siteUrl } from "@/lib/site"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-playfair", display: "swap" })

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["HRM", "HRIS", "payroll", "timekeeping", "201 file", "leave", "recruitment", "GD Prime", "GPPMC", "Philippines"],
  authors: [{ name: "GD Prime Property Management Corporation" }],
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, locale: "en_PH" },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#0a1f5c" }, { media: "(prefers-color-scheme: dark)", color: "#0b1226" }],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value)
  const viewer = await getViewer()
  const groups: NavGroup[] = GROUPS.map((g) => ({ code: g.code, name: g.name, modules: g.modules.map((c) => { const m = moduleByCode(c)!; return { code: m.code, name: m.name, num: m.num } }) }))
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`} data-theme={theme === "system" ? undefined : theme}>
      <body className="min-h-dvh">
        <AppShell groups={groups} role={viewer.role} roleLabel={viewer.label} userName={fullName(viewer.self)}>{children}</AppShell>
      </body>
    </html>
  )
}
