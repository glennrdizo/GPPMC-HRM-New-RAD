// Night mode: "system" follows the device; "light" and "dark" are a choice remembered on this device.
export type Theme = "system" | "light" | "dark"
export const THEME_COOKIE = "gdp_theme"

export const parseTheme = (v: string | undefined): Theme => (v === "light" || v === "dark" ? v : "system")

export const themeCookie = (t: Theme) => `${THEME_COOKIE}=${t}; Path=/; Max-Age=31536000; SameSite=Lax`
