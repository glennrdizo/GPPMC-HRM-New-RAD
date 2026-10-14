"use client"
import { useEffect, useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/cn"
import { parseTheme, THEME_COOKIE, themeCookie, type Theme } from "@/lib/theme"

const OPTIONS: [Theme, string, typeof Sun][] = [["system", "System", Monitor], ["light", "Light", Sun], ["dark", "Dark", Moon]]

function apply(t: Theme) {
  document.cookie = themeCookie(t)
  if (t === "system") delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
}

// Night mode switch in the sidebar. The root layout reads the same cookie, so the next page loads in this theme.
export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system")
  useEffect(() => {
    setTheme(parseTheme(document.cookie.split("; ").find((c) => c.startsWith(`${THEME_COOKIE}=`))?.split("=")[1]))
  }, [])
  const choose = (t: Theme) => { setTheme(t); apply(t) }

  if (compact) {
    const i = OPTIONS.findIndex(([t]) => t === theme)
    const [, label, Icon] = OPTIONS[i]
    const [next, nextLabel] = OPTIONS[(i + 1) % OPTIONS.length]
    return (
      <button onClick={() => choose(next)} aria-label={`Theme: ${label}. Switch to ${nextLabel}`} title={`Theme: ${label}`}
        className="flex min-h-11 w-full items-center justify-center rounded-lg text-navy-muted hover:bg-white/5 hover:text-white">
        <Icon className="size-5" aria-hidden />
      </button>
    )
  }
  return (
    <div role="radiogroup" aria-label="Theme" className="mb-2 grid grid-cols-3 gap-1 rounded-xl border border-gold/25 bg-white/5 p-1">
      {OPTIONS.map(([t, label, Icon]) => (
        <button key={t} role="radio" aria-checked={theme === t} onClick={() => choose(t)}
          className={cn("flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold",
            theme === t ? "bg-gold/20 text-white" : "text-navy-muted hover:bg-white/5 hover:text-white")}>
          <Icon className="size-4" aria-hidden />{label}
        </button>
      ))}
    </div>
  )
}
