"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, LayoutDashboard, Map, Menu, Search, X } from "lucide-react"
import { cn } from "@/lib/cn"
import { GROUP_ICONS, MODULE_ICONS } from "@/lib/icons"
import { ThemeSwitch } from "@/components/theme-switch"
import { ViewAs } from "@/components/view-as"
import type { ViewRole } from "@/lib/viewer-roles"

export type NavGroup = { code: string; name: string; modules: { code: string; name: string; num: string }[] }

const COLLAPSED_KEY = "hrm-sidebar-collapsed"
const OPEN_KEY = "hrm-sidebar-open"

export function AppShell({ groups, role, roleLabel, userName, children }: { groups: NavGroup[]; role: ViewRole; roleLabel: string; userName: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [open, setOpen] = useState<string[]>([])
  const activeCode = pathname.startsWith("/m/") ? pathname.split("/")[2]?.toUpperCase() : pathname.startsWith("/employees") ? "ECR" : undefined
  const activeGroup = groups.find((g) => g.modules.some((m) => m.code === activeCode))?.code

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "1")
      setOpen((o) => [...new Set([...o, ...JSON.parse(localStorage.getItem(OPEN_KEY) ?? "[]")])])
    } catch { /* storage blocked */ }
  }, [])
  useEffect(() => setDrawer(false), [pathname])
  useEffect(() => { if (activeGroup) setOpen((o) => (o.includes(activeGroup) ? o : [...o, activeGroup])) }, [activeGroup])

  // Mobile menu: Escape closes it, focus moves into it, and the page behind does not scroll.
  const drawerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawer(false) }
    window.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus()
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow }
  }, [drawer])

  const toggleGroup = (code: string) => setOpen((o) => {
    const next = o.includes(code) ? o.filter((x) => x !== code) : [...o, code]
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(next)) } catch { /* storage blocked */ }
    return next
  })
  const toggleRail = () => setCollapsed((c) => {
    try { localStorage.setItem(COLLAPSED_KEY, c ? "0" : "1") } catch { /* storage blocked */ }
    return !c
  })
  const title = pathname === "/" ? "Dashboard" : pathname === "/modules" ? "Module map" : groups.flatMap((g) => g.modules).find((m) => m.code === activeCode)?.name ?? "GD Prime HRM"

  const topLink = (href: string, label: string, Icon: typeof Map, rail: boolean) => {
    const on = pathname === href
    return (
      <Link href={href} aria-current={on ? "page" : undefined} title={rail ? label : undefined} aria-label={rail ? label : undefined}
        className={cn("mb-1 flex min-h-11 items-center gap-3 rounded-xl px-2.5 text-sm font-bold", rail && "justify-center px-0",
          on ? "nav-active text-white" : "text-navy-foreground hover:bg-white/[0.07] hover:text-white")}>
        <Icon className="size-5 shrink-0 text-gold-light" aria-hidden />{!rail && label}
      </Link>
    )
  }

  const sidebar = (mobile: boolean) => {
    const rail = collapsed && !mobile
    return (
      <nav aria-label="Main" className="bg-rail flex h-full flex-col text-navy-foreground">
        <div className={cn("flex items-center gap-3 border-b border-gold/25 px-4 pb-5 pt-6", rail && "justify-center px-2")}>
          {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
          <img src="/gppmc-logo.png" alt="GD Prime Property Management Corporation logo" width={rail ? 40 : 48} height={rail ? 40 : 48}
            className={cn("logo-ring shrink-0 rounded-full bg-white p-0.5", rail ? "size-10" : "size-12")} />
          {!rail && (
            <div className="min-w-0">
              <p className="font-serif text-[17px] font-bold leading-tight text-white">GD Prime HRM</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-light">28 modules · 8 groups</p>
            </div>
          )}
          {mobile && (
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="ml-auto grid size-11 shrink-0 place-items-center rounded-xl border border-gold/35 hover:border-gold hover:bg-white/10">
              <X className="size-5" aria-hidden />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {topLink("/", "Dashboard", LayoutDashboard, rail)}
          {topLink("/modules", "Module map", Map, rail)}
          <div className="mx-2 my-3 h-px bg-gold/20" aria-hidden />
          {groups.map((g) => {
            const Icon = GROUP_ICONS[g.code]
            const isOpen = open.includes(g.code)
            const here = g.code === activeGroup
            if (rail) {
              return (
                <Link key={g.code} href={`/m/${g.modules[0].code.toLowerCase()}`} title={g.name} aria-label={g.name}
                  className={cn("mb-1 flex min-h-11 items-center justify-center rounded-xl", here ? "nav-active text-gold-light" : "text-gold-text hover:bg-white/10 hover:text-white")}>
                  <Icon className="size-5" aria-hidden />
                </Link>
              )
            }
            return (
              <div key={g.code} className="mb-1">
                <button onClick={() => toggleGroup(g.code)} aria-expanded={isOpen}
                  className="group flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-gold-text hover:bg-white/[0.07] hover:text-white">
                  <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] border border-gold/35 bg-gold/15 text-gold-light transition-colors group-hover:border-gold group-hover:bg-gold/25"><Icon className="size-[18px]" aria-hidden /></span>
                  <span className="flex-1 leading-snug"><span className="text-gold-light/80">{g.code} · </span>{g.name}</span>
                  {isOpen ? <ChevronDown className="size-4 shrink-0 opacity-85" aria-hidden /> : <ChevronRight className="size-4 shrink-0 opacity-85" aria-hidden />}
                </button>
                {isOpen && (
                  <ul className="mb-3 ml-[25px] mt-1 flex flex-col gap-0.5 border-l-2 border-gold/25 pl-2.5">
                    {g.modules.map((m) => {
                      const on = m.code === activeCode
                      const MIcon = MODULE_ICONS[m.code]
                      return (
                        <li key={m.code}>
                          <Link href={`/m/${m.code.toLowerCase()}`} aria-current={on ? "page" : undefined}
                            className={cn("flex min-h-11 items-center gap-2.5 rounded-[10px] px-2.5 text-sm font-semibold",
                              on ? "nav-active text-white" : "text-navy-foreground hover:translate-x-0.5 hover:bg-white/[0.07] hover:text-white")}>
                            <MIcon className="size-[18px] shrink-0" aria-hidden />
                            <span className="flex-1 leading-snug">{m.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
        <div className="border-t border-gold/20 p-3">
          {!rail && (
            <div className="mb-2 rounded-2xl border border-gold/25 bg-white/5 p-3">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <p className="truncate text-xs text-navy-muted">Viewing as {roleLabel}</p>
            </div>
          )}
          {mobile && <div className="mb-2"><ViewAs role={role} dark /></div>}
          <ThemeSwitch compact={rail} />
          {!mobile && (
            <button onClick={toggleRail} aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              className="mt-1 flex min-h-11 w-full items-center justify-center rounded-lg text-navy-muted hover:bg-white/10 hover:text-white">
              {collapsed ? <ChevronsRight className="size-5" aria-hidden /> : <ChevronsLeft className="size-5" aria-hidden />}
            </button>
          )}
        </div>
      </nav>
    )
  }

  return (
    <div className="min-h-dvh lg:flex">
      <a href="#main" className="skip-link">Skip to main content</a>
      <aside className={cn("sticky top-0 hidden h-dvh shrink-0 transition-[width] duration-300 lg:block print:hidden", collapsed ? "w-[72px]" : "w-[300px]")}>
        {sidebar(false)}
      </aside>

      {drawer && (
        <div ref={drawerRef} className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-[#050f2e]/60 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="animate-rise absolute inset-y-0 left-0 w-80 max-w-[88vw] shadow-2xl">{sidebar(true)}</aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="bg-rail sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gold/30 px-3 pt-[env(safe-area-inset-top)] text-white sm:px-5 lg:hidden print:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
          <img src="/gppmc-logo.png" alt="" width={36} height={36} className="logo-ring size-9 rounded-full bg-white p-0.5" />
          <p className="min-w-0 flex-1 truncate font-serif text-lg font-semibold">{title}</p>
          <Link href="/search" aria-label="Search" className="grid size-11 place-items-center rounded-xl border border-gold/35 bg-white/5 hover:border-gold hover:bg-white/10"><Search className="size-5" aria-hidden /></Link>
          <button onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer} className="grid size-11 place-items-center rounded-xl border border-gold/35 bg-white/5 hover:border-gold hover:bg-white/10">
            <Menu className="size-5" aria-hidden />
          </button>
        </header>
        <div className="sticky top-0 z-20 hidden border-b border-border bg-background/85 backdrop-blur-md lg:block print:hidden">
          <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-4 px-10">
            <form action="/search" role="search" className="flex min-h-11 max-w-md flex-1 items-center gap-2 rounded-xl border border-border-strong bg-surface px-3.5 text-muted transition-colors focus-within:border-primary hover:border-gold/70">
              <Search className="size-4 shrink-0" aria-hidden />
              <input name="q" type="search" aria-label="Search employees and modules" placeholder="Search employees, modules or submodules" className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted" />
            </form>
            <div className="ml-auto"><ViewAs role={role} /></div>
          </div>
        </div>
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1360px] px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-6 outline-none sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  )
}
