import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock, Users, Wallet, Workflow, Briefcase } from "lucide-react"
import { Badge, Card, LinkButton, StatCard } from "@/components/ui"
import { CLUSTERS, LEAVES, PROPERTIES, REQUESTS, TODAY, ATTENDANCE, ACTIVE, nameOf, probationEnd, propertyName } from "@/lib/data"
import { formatDate } from "@/lib/format"
import { GROUPS, MODULES, releaseCount } from "@/lib/modules"
import { MODULE_ICONS } from "@/lib/icons"
import { getViewer, inScope } from "@/lib/viewer"
import { dashboardWorkspace } from "@/lib/workspaces"

export const metadata: Metadata = { title: { absolute: "Dashboard | GD Prime HRM" }, alternates: { canonical: "/" } }

const ICONS = [Users, Clock, Workflow, Briefcase]

export default async function Dashboard() {
  const v = await getViewer()
  const ws = dashboardWorkspace(v)
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${TODAY}T00:00:00Z`))
  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Manila" }).format(new Date()))
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const people = ACTIVE.filter((e) => inScope(v, e.id))
  const pending = REQUESTS.filter((r) => r.status === "Pending" && inScope(v, r.emp)).sort((a, b) => a.sla.localeCompare(b.sla)).slice(0, 6)
  const onLeave = LEAVES.filter((l) => l.status === "Approved" && l.from <= TODAY && l.to >= TODAY && inScope(v, l.emp))
  const probation = people.filter((e) => e.status === "Probationary").map((e) => ({ e, end: probationEnd(e) })).sort((a, b) => a.end.localeCompare(b.end)).slice(0, 5)
  const byProperty = PROPERTIES.filter((p) => !v.properties || v.properties.includes(p.id)).map((p) => {
    const att = ATTENDANCE.filter((a) => people.some((e) => e.id === a.emp && e.property === p.id) && a.status !== "Rest day")
    const present = att.filter((a) => a.status === "Present" || a.status === "Late").length
    return { p, present, total: att.length, pct: att.length ? Math.round((present / att.length) * 100) : 0 }
  })
  const byCluster = ["Head Office", ...CLUSTERS].map((c) => ({ c, n: people.filter((e) => PROPERTIES.find((p) => p.id === e.property)?.cluster === c).length })).filter((x) => x.n)
  const maxCluster = Math.max(...byCluster.map((x) => x.n), 1)
  const pill = "inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/40 bg-white/[0.08] px-4 text-sm font-bold text-white hover:border-gold hover:bg-white/[0.16]"

  return (
    <>
      <section aria-labelledby="hello" className="bg-hero relative mb-8 overflow-hidden rounded-3xl p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">{date}</p>
            <h1 id="hello" className="mt-2 text-[32px] leading-tight sm:text-[42px]">{greeting}, <span className="text-gold-shine">{v.self.first}</span></h1>
            <p className="mt-2 max-w-xl text-[15px] text-navy-foreground">GD Prime Property Management Corporation · viewing as {v.label}{v.properties && v.role === "CLH" ? " (Cluster 1)" : ""}</p>
          </div>
          <nav aria-label="Quick links" className="flex flex-wrap gap-2">
            <Link href="/m/tka" className={pill}><Clock className="size-4" aria-hidden />Attendance</Link>
            <Link href="/m/lvm" className={pill}><CalendarDays className="size-4" aria-hidden />Leave</Link>
            <Link href="/m/wan" className={pill}><Workflow className="size-4" aria-hidden />Approvals</Link>
            {v.seesPay && <Link href="/m/pay" className={pill}><Wallet className="size-4" aria-hidden />Payroll</Link>}
          </nav>
        </div>
      </section>

      <h2 className="sr-only">Key figures</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ws.stats.map((s, i) => { const Icon = ICONS[i]; return <StatCard key={s.label} stat={s} icon={<Icon className="size-5" aria-hidden />} /> })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 sm:p-6 xl:col-span-2">
          <PanelHead title="Waiting for approval" href="/m/wan" />
          {pending.length === 0 ? <p className="text-sm text-muted">Nothing waiting in your scope.</p> : (
            <ul className="divide-y divide-border">
              {pending.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.type} · {nameOf(r.emp)}</p>
                    <p className="text-xs text-muted">{r.id} · {r.step} · due {formatDate(r.sla)}</p>
                  </div>
                  <Badge>{r.overdue ? "Overdue" : "Pending"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <PanelHead title="Headcount by cluster" href="/m/org" />
          <ul className="flex flex-col gap-3.5">
            {byCluster.map(({ c, n }) => (
              <li key={c}>
                <div className="flex justify-between gap-2 text-sm"><span className="font-semibold">{c}</span><span className="tabular text-muted">{n}</span></div>
                <div className="mt-1.5 h-2.5 rounded-full bg-surface-muted"><div className="h-full rounded-full bg-gradient-to-r from-navy-2 to-[#4b6fd8]" style={{ width: `${(n / maxCluster) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6 xl:col-span-2">
          <PanelHead title="Attendance today by property" href="/m/tka" />
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {byProperty.map(({ p, present, total, pct }) => (
              <li key={p.id}>
                <div className="flex justify-between gap-2 text-sm"><span className="truncate font-semibold">{p.name}</span><span className="tabular shrink-0 text-muted">{present}/{total} · {pct}%</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-surface-muted"><div className={`h-full rounded-full ${pct >= 90 ? "bg-success" : pct >= 75 ? "bg-gold" : "bg-danger"}`} style={{ width: `${pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex flex-col gap-6">
          <Card className="p-5 sm:p-6">
            <PanelHead title="On leave today" href="/m/lvm" />
            {onLeave.length === 0 ? <p className="text-sm text-muted">No one on approved leave today.</p> : (
              <ul className="flex flex-col gap-2.5 text-sm">{onLeave.map((l) => <li key={l.id} className="flex justify-between gap-2"><span className="font-semibold">{nameOf(l.emp)}</span><span className="text-muted">{l.type} · until {formatDate(l.to)}</span></li>)}</ul>
            )}
          </Card>
          <Card className="p-5 sm:p-6">
            <PanelHead title="Probation ending" href="/m/pes" />
            {probation.length === 0 ? <p className="text-sm text-muted">No one on probation in your scope.</p> : (
              <ul className="-mx-2 flex flex-col text-sm">{probation.map(({ e, end }) => <li key={e.id}><Link href={`/employees/${e.id}`} className="block min-h-11 rounded-lg px-2 py-2 hover:bg-hover"><span className="flex justify-between gap-2"><span className="font-semibold">{e.first} {e.last}</span><span className="shrink-0 text-muted">{formatDate(end)}</span></span><span className="text-xs text-muted">{e.position} · {propertyName(e.property)}</span></Link></li>)}</ul>
            )}
          </Card>
        </div>
      </div>

      <section aria-labelledby="platform" className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gold-strong">HRM Platform</p>
            <h2 id="platform" className="text-2xl sm:text-3xl">{MODULES.length} modules in {GROUPS.length} groups</h2>
          </div>
          <LinkButton href="/modules" variant="outline">Module map<ArrowRight className="size-4" aria-hidden /></LinkButton>
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3 sm:max-w-xl">
          {(["R1", "R2", "R3"] as const).map((r, i) => (
            <div key={r} className="rounded-2xl border border-border bg-surface p-4 text-center">
              <p className="tabular font-serif text-2xl font-bold text-info">{releaseCount(r)}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{r} {["Foundation", "Control", "Intelligence"][i]}</p>
            </div>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {MODULES.map((m) => { const Icon = MODULE_ICONS[m.code]; return (
            <li key={m.code}>
              <Link href={`/m/${m.code.toLowerCase()}`} className="card-hover flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow)]">
                <span className="flex items-center justify-between"><Icon className="size-5 text-gold-strong" aria-hidden /><span className="tabular text-[11px] font-extrabold tracking-wide text-muted">{m.code}</span></span>
                <span className="text-sm font-semibold leading-snug">{m.name}</span>
              </Link>
            </li>
          ) })}
        </ul>
      </section>
    </>
  )
}

function PanelHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg">{title}</h2>
      <Link href={href} className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-gold-strong hover:underline">View all<ArrowRight className="size-3.5" aria-hidden /></Link>
    </div>
  )
}
