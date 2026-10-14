import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Info } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Card, PageHeader, ReleaseBadge, StatCard } from "@/components/ui"
import { cn } from "@/lib/cn"
import { MODULE_ICONS } from "@/lib/icons"
import { MODULES, groupOf, moduleByCode, type Release } from "@/lib/modules"
import { getViewer } from "@/lib/viewer"
import { workspace } from "@/lib/workspaces"

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ r?: string }> }

export function generateStaticParams() { return MODULES.map((m) => ({ code: m.code.toLowerCase() })) }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = moduleByCode((await params).code)
  if (!m) return {}
  return { title: `${m.name} (HRM-${m.num})`, description: m.purpose, alternates: { canonical: `/m/${m.code.toLowerCase()}` } }
}

export default async function ModulePage({ params, searchParams }: Props) {
  const [{ code }, { r }] = await Promise.all([params, searchParams])
  const m = moduleByCode(code)
  if (!m) notFound()
  const v = await getViewer()
  const ws = workspace(m.code, v)
  const g = groupOf(m)
  const Icon = MODULE_ICONS[m.code]
  const release = (["R1", "R2", "R3"] as const).includes(r as Release) ? (r as Release) : undefined
  const subs = release ? m.subs.filter((s) => s.release === release) : m.subs
  const filters: [string, string | undefined][] = [["All", undefined], ["R1", "R1"], ["R2", "R2"], ["R3", "R3"]]

  return (
    <>
      <PageHeader eyebrow={`Group ${g.code} · ${g.name}`} title={m.name} description={m.purpose}
        action={<span className="inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-gold-soft px-3.5 py-2 text-sm font-bold text-gold-strong"><Icon className="size-4" aria-hidden />HRM-{m.num} · {m.code}</span>} />

      {ws.note && (
        <p role="note" className="mb-6 flex items-start gap-3 rounded-2xl border border-info/25 bg-info-soft px-4 py-3 text-sm text-info">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />{ws.note}
        </p>
      )}

      {ws.stats.length > 0 && (
        <section aria-label="Key figures" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ws.stats.map((s) => <StatCard key={s.label} stat={s} />)}
        </section>
      )}

      {ws.tables.map((t) => (
        <section key={t.title} aria-labelledby={slug(t.title)} className="mt-10">
          <h2 id={slug(t.title)} className="text-xl sm:text-2xl">{t.title}</h2>
          {t.description && <p className="mt-1.5 max-w-3xl text-sm text-muted">{t.description}</p>}
          <div className="mt-4"><DataTable table={t} seesPay={v.seesPay} /></div>
        </section>
      ))}

      <section aria-labelledby="about" className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 sm:p-6">
          <h2 id="about" className="text-xl">About this module</h2>
          <dl className="mt-4 flex flex-col gap-4 text-sm">
            {([["Owner", m.owner], ["Primary users", m.users], ["Key records", m.records], ["KPIs fed", m.kpis]] as const).map(([k, val]) => (
              <div key={k}><dt className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{k}</dt><dd className="mt-1 leading-relaxed">{val || "-"}</dd></div>
            ))}
          </dl>
        </Card>
        <div className="xl:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl">Submodules <span className="tabular text-base font-sans font-semibold text-muted">({m.subs.length})</span></h2>
            <nav aria-label="Filter by release" className="inline-flex rounded-full border border-border bg-surface p-1">
              {filters.map(([label, val]) => (
                <Link key={label} href={val ? `?r=${val}` : `/m/${m.code.toLowerCase()}`} scroll={false} aria-current={release === val ? "page" : undefined}
                  className={cn("inline-flex min-h-10 min-w-12 items-center justify-center rounded-full px-3.5 text-sm font-bold", release === val ? "bg-navy text-gold-light" : "text-muted hover:bg-hover hover:text-foreground")}>{label}</Link>
              ))}
            </nav>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {subs.map((s) => (
              <li key={s.code} className="card-hover rounded-[var(--radius)] border border-border bg-surface p-5 shadow-[var(--shadow)]">
                <div className="flex items-start justify-between gap-3">
                  <p className="tabular text-xs font-extrabold tracking-wide text-muted">HRM-{s.code}</p>
                  <ReleaseBadge release={s.release} />
                </div>
                <h3 className="mt-1.5 text-base leading-snug">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.functions}</p>
                <p className="mt-3 text-xs font-semibold text-foreground"><span className="text-muted">Users: </span>{s.users}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
