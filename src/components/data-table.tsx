import Link from "next/link"
import { Lock } from "lucide-react"
import { Badge, Card, EmptyState } from "@/components/ui"
import { cn } from "@/lib/cn"
import { employee, fullName, propertyName } from "@/lib/data"
import { formatDate, formatNumber, formatPeso } from "@/lib/format"
import type { Column, Row, Table } from "@/lib/workspaces"

function Cell({ col, row, seesPay }: { col: Column; row: Row; seesPay: boolean }) {
  const v = row[col.key]
  if (col.pay && !seesPay) return <span className="inline-flex items-center gap-1 text-muted"><Lock className="size-3.5" aria-hidden /><span className="sr-only">Restricted</span>•••••</span>
  if (v === undefined || v === "" || v === "-") return <span className="text-muted">-</span>
  switch (col.kind) {
    case "emp": { const e = employee(String(v)); return e ? <span className="font-semibold">{fullName(e)}<span className="block text-xs font-normal text-muted">{e.position}</span></span> : <>{v}</> }
    case "property": return <>{propertyName(String(v))}</>
    case "date": return <span className="whitespace-nowrap">{formatDate(String(v))}</span>
    case "money": return <span className="tabular whitespace-nowrap">{formatPeso(Number(v))}</span>
    case "number": return <span className="tabular">{formatNumber(Number(v))}</span>
    case "percent": return <span className="tabular">{v}%</span>
    case "badge": return <Badge>{v}</Badge>
    case "id": return <span className="tabular whitespace-nowrap text-xs font-bold tracking-wide text-muted">{v}</span>
    default: return <>{v}</>
  }
}

const numeric = (c: Column) => c.kind === "money" || c.kind === "number" || c.kind === "percent"

// Table from tablet up, stacked cards on phones. Pay columns are masked for roles without pay access.
export function DataTable({ table, seesPay, limit }: { table: Table; seesPay: boolean; limit?: number }) {
  const rows = limit ? table.rows.slice(0, limit) : table.rows
  if (!rows.length) return <EmptyState title="Nothing to show" description="No records in your scope." />
  const primary = table.columns.find((c) => c.primary) ?? table.columns[0]
  return (
    <>
      <Card className="table-scroll hidden md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">{table.title}</caption>
          <thead className="bg-surface-muted text-left text-[11px] uppercase text-muted">
            <tr>{table.columns.map((c) => <th key={c.key} scope="col" className={cn("whitespace-nowrap px-4 py-3.5 font-bold", numeric(c) && "text-right")}>{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => {
              const href = table.href?.(r)
              return (
                <tr key={i} className={cn(href && "cursor-pointer")}>
                  {table.columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3 align-top", numeric(c) && "text-right")}>
                      {href && c === primary ? <Link href={href} className="rounded underline-offset-4 hover:text-info hover:underline"><Cell col={c} row={r} seesPay={seesPay} /></Link> : <Cell col={c} row={r} seesPay={seesPay} />}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((r, i) => {
          const href = table.href?.(r)
          const body = (
            <>
              <div className="font-semibold"><Cell col={primary} row={r} seesPay={seesPay} /></div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {table.columns.filter((c) => c !== primary).map((c) => (
                  <div key={c.key} className="min-w-0"><dt className="text-xs font-semibold text-muted">{c.label}</dt><dd className="mt-0.5 break-words"><Cell col={c} row={r} seesPay={seesPay} /></dd></div>
                ))}
              </dl>
            </>
          )
          return <li key={i}>{href ? <Link href={href} className="card-hover block rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow)]">{body}</Link> : <Card className="p-4">{body}</Card>}</li>
        })}
      </ul>
    </>
  )
}
