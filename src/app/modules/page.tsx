import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageHeader, ReleaseBadge } from "@/components/ui"
import { GROUP_ICONS, MODULE_ICONS } from "@/lib/icons"
import { GROUPS, MODULES, moduleByCode, releaseCount } from "@/lib/modules"

export const metadata: Metadata = {
  title: "Module map",
  description: "The 28 modules and 196 submodules of the GD Prime HRM Platform, in eight functional groups and three releases.",
  alternates: { canonical: "/modules" },
}

const RELEASES = [
  { r: "R1", name: "Foundation", theme: "Hire, record, time, pay, separate" },
  { r: "R2", name: "Control", theme: "Talent, compliance, deployment" },
  { r: "R3", name: "Intelligence", theme: "Analytics, engagement, experience" },
] as const

export default function ModuleMap() {
  const total = MODULES.reduce((n, m) => n + m.subs.length, 0)
  return (
    <>
      <PageHeader eyebrow="GPPMC-GDP1-ARC-HRM-001" title="Module map" description={`${MODULES.length} modules and ${total} submodules in ${GROUPS.length} functional groups. Employee Core Records (HRM-03) feeds every other module.`} />
      <ol className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {RELEASES.map((x) => (
          <li key={x.r} className="bg-hero relative overflow-hidden rounded-[var(--radius)] p-5 text-white sm:p-6">
            <div className="relative z-10 flex items-baseline justify-between">
              <p className="font-serif text-3xl font-bold text-gold-light">{x.r}</p>
              <p className="tabular text-sm font-semibold text-navy-foreground">{releaseCount(x.r)} submodules</p>
            </div>
            <p className="relative z-10 mt-2 font-serif text-xl">{x.name}</p>
            <p className="relative z-10 mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-text">{x.theme}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-10">
        {GROUPS.map((g) => {
          const GIcon = GROUP_ICONS[g.code]
          return (
            <section key={g.code} aria-labelledby={`g-${g.code}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-navy text-gold-light"><GIcon className="size-5" aria-hidden /></span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gold-strong">Group {g.code}</p>
                  <h2 id={`g-${g.code}`} className="text-2xl">{g.name}</h2>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {g.modules.map((c) => {
                  const m = moduleByCode(c)!
                  const Icon = MODULE_ICONS[m.code]
                  const n = (r: string) => m.subs.filter((s) => s.release === r).length
                  return (
                    <li key={m.code}>
                      <Link href={`/m/${m.code.toLowerCase()}`} className="card-hover group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5 shadow-[var(--shadow)] sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-11 place-items-center rounded-xl border border-gold/50 bg-gold-soft text-gold-strong"><Icon className="size-5" aria-hidden /></span>
                          <span className="tabular text-xs font-extrabold tracking-wide text-muted">HRM-{m.num} · {m.code}</span>
                        </div>
                        <h3 className="mt-4 text-lg leading-snug">{m.name}</h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{m.purpose}</p>
                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                          <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                            {(["R1", "R2", "R3"] as const).filter((r) => n(r)).map((r) => <span key={r} className="inline-flex items-center gap-1"><ReleaseBadge release={r} /><span className="tabular font-semibold">{n(r)}</span></span>)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-info transition-transform group-hover:translate-x-0.5">Open<ArrowRight className="size-4" aria-hidden /></span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
