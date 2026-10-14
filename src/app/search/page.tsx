import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"
import { Card, PageHeader, ReleaseBadge, inputClass } from "@/components/ui"
import { EMPLOYEES, fullName, propertyName } from "@/lib/data"
import { MODULES } from "@/lib/modules"
import { getViewer, inScope } from "@/lib/viewer"

export const metadata: Metadata = { title: "Search", robots: { index: false } }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim()
  const v = await getViewer()
  const t = q.toLowerCase()
  const people = t ? EMPLOYEES.filter((e) => inScope(v, e.id) && `${fullName(e)} ${e.id} ${e.position} ${propertyName(e.property)}`.toLowerCase().includes(t)).slice(0, 25) : []
  const mods = t ? MODULES.filter((m) => `${m.name} ${m.code} hrm-${m.num} ${m.purpose}`.toLowerCase().includes(t)) : []
  const subs = t ? MODULES.flatMap((m) => m.subs.map((s) => ({ m, s }))).filter(({ s }) => `${s.name} hrm-${s.code} ${s.functions}`.toLowerCase().includes(t)).slice(0, 30) : []

  return (
    <>
      <PageHeader title="Search" description="Find employees in your scope, modules and submodules." />
      <form role="search" className="mb-8 flex max-w-2xl gap-2">
        <label htmlFor="q" className="sr-only">Search</label>
        <input id="q" name="q" type="search" defaultValue={q} autoFocus placeholder="Name, employee number, position, module or submodule" className={inputClass} />
        <button className="btn-primary-grad inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white"><Search className="size-4" aria-hidden /><span className="hidden sm:inline">Search</span></button>
      </form>
      {q && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Results title={`Employees (${people.length})`}>
            {people.map((e) => <li key={e.id}><Link href={`/employees/${e.id}`} className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 hover:bg-hover"><span className="text-sm font-semibold">{fullName(e)} <span className="text-xs font-bold text-muted">{e.id}</span></span><span className="text-xs text-muted">{e.position} · {propertyName(e.property)} · {e.status}</span></Link></li>)}
          </Results>
          <Results title={`Modules and submodules (${mods.length + subs.length})`}>
            {mods.map((m) => <li key={m.code}><Link href={`/m/${m.code.toLowerCase()}`} className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 hover:bg-hover"><span className="text-sm font-semibold">{m.name}</span><span className="text-xs text-muted">Module HRM-{m.num} · {m.code}</span></Link></li>)}
            {subs.map(({ m, s }) => <li key={s.code}><Link href={`/m/${m.code.toLowerCase()}?r=${s.release}`} className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-hover"><span><span className="block text-sm font-semibold">{s.name}</span><span className="text-xs text-muted">HRM-{s.code} · {m.name}</span></span><ReleaseBadge release={s.release} /></Link></li>)}
          </Results>
        </div>
      )}
    </>
  )
}

function Results({ title, children }: { title: string; children: React.ReactNode }) {
  const empty = !(Array.isArray(children) ? children.flat().length : children)
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="mb-2 px-1 text-lg">{title}</h2>
      {empty ? <p className="px-1 text-sm text-muted">No matches.</p> : <ul className="flex flex-col">{children}</ul>}
    </Card>
  )
}
