import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Lock, Mail, MapPin, Phone } from "lucide-react"
import { Badge, Card, EmptyState } from "@/components/ui"
import { ATTENDANCE, LEAVES, PAYROLL, PAY_PERIOD, employee, fullName, leaveBalance, nameOf, probationEnd, propertyOf } from "@/lib/data"
import { formatDate, formatPeso, maskId } from "@/lib/format"
import { getViewer, inScope } from "@/lib/viewer"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = employee((await params).id)
  return { title: e ? `${fullName(e)} - 201 file` : "Employee", robots: { index: false } }
}

const DOCS = ["Signed employment contract", "NBI clearance", "Pre-employment medical", "Birth certificate (PSA)", "SSS, PhilHealth, Pag-IBIG, TIN proofs", "Diploma / transcript", "Signed Code of Conduct acknowledgment", "Data privacy consent"]

export default async function EmployeeFile({ params }: Props) {
  const { id } = await params
  const e = employee(id)
  if (!e) notFound()
  const v = await getViewer()
  if (!inScope(v, e.id)) {
    return <EmptyState title="This 201 file is outside your scope" description={`As ${v.label}, you can see only the people in your data scope (HRM-00.03). Switch "View as" to see more.`} />
  }
  const p = propertyOf(e)
  const att = ATTENDANCE.find((a) => a.emp === e.id)
  const pay = PAYROLL.find((x) => x.emp === e.id)
  const showPay = v.seesPay || e.id === v.self.id
  const years = 2026 - Number(e.hired.slice(0, 4))
  const missing = Number(e.id.slice(-1)) % 4 === 0 ? 1 : 0
  const initials = `${e.first[0]}${e.last[0]}`

  return (
    <>
      <Link href="/m/ecr" className="mb-5 inline-flex min-h-11 items-center gap-1.5 rounded-lg pr-2 text-sm font-semibold text-muted hover:text-foreground"><ArrowLeft className="size-4" aria-hidden />Employee masterlist</Link>
      <section aria-labelledby="name" className="bg-hero relative mb-8 overflow-hidden rounded-3xl p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid size-20 shrink-0 place-items-center rounded-full bg-white/10 font-serif text-3xl font-bold text-gold-light ring-2 ring-gold/60" aria-hidden>{initials}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">201 file · {e.id}</p>
            <h1 id="name" className="mt-1 text-[30px] leading-tight sm:text-[38px]">{fullName(e)}</h1>
            <p className="mt-1 text-navy-foreground">{e.position} · {e.dept}</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-navy-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-gold-light" aria-hidden />{p.name}</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="size-4 text-gold-light" aria-hidden />{e.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="size-4 text-gold-light" aria-hidden />{e.mobile}</span>
            </p>
          </div>
          <span className="self-start rounded-full bg-white px-3 py-1 text-sm font-bold text-navy">{e.status}</span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Section title="Employment">
            <Defs items={[["Employee number", e.id], ["Position", e.position], ["Band", e.band], ["Department", e.dept], ["Property", p.name], ["Cluster", p.cluster],
              ["Date hired", formatDate(e.hired)], ["Length of service", `${years} year${years === 1 ? "" : "s"}`], ["Status", e.status], ["Reports to", nameOf(e.manager)],
              ...(e.status === "Probationary" ? [["Probation ends", formatDate(probationEnd(e))] as [string, string]] : [])]} />
          </Section>
          <Section title="Personal">
            <Defs items={[["Birthday", formatDate(e.birth)], ["Gender", e.gender === "F" ? "Female" : "Male"], ["Civil status", e.civil], ["Address", e.address], ["Mobile", e.mobile], ["Email", e.email]]} />
          </Section>
          <Section title="Government numbers" note="Masked by default (DP-09). Viewing in full is logged to the audit trail.">
            <Defs items={[["SSS", maskId(e.sss)], ["PhilHealth", maskId(e.philhealth)], ["Pag-IBIG", maskId(e.pagibig)], ["TIN", maskId(e.tin)]]} />
          </Section>
          <Section title="Pay">
            {showPay && pay ? (
              <Defs items={[["Monthly rate", formatPeso(e.rate)], ["Current run", PAY_PERIOD.label], ["Gross", formatPeso(pay.gross)], ["Statutory deductions", formatPeso(pay.sss + pay.philhealth + pay.pagibig)], ["Withholding tax", formatPeso(pay.tax)], ["Net pay", formatPeso(pay.net)]]} />
            ) : <p className="flex items-center gap-2 text-sm text-muted"><Lock className="size-4" aria-hidden />Pay is restricted for {v.label}.</p>}
          </Section>
        </div>
        <div className="flex flex-col gap-6">
          <Section title="Today">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>{att ? `${att.shift} · in ${att.timeIn}` : "No schedule"}</span>
              {att && <Badge>{att.status}</Badge>}
            </div>
          </Section>
          <Section title="Leave balances">
            <ul className="flex flex-col gap-3.5">
              {leaveBalance(e).map((b) => (
                <li key={b.code}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{b.name}</span><span className="tabular text-muted">{b.balance} of {b.credits}</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-surface-muted"><div className="h-full rounded-full bg-gold" style={{ width: `${b.credits ? (b.balance / b.credits) * 100 : 0}%` }} /></div>
                </li>
              ))}
            </ul>
            {LEAVES.some((l) => l.emp === e.id) && (
              <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                {LEAVES.filter((l) => l.emp === e.id).map((l) => <li key={l.id} className="flex items-center justify-between gap-2"><span>{l.type} · {formatDate(l.from)}</span><Badge>{l.status}</Badge></li>)}
              </ul>
            )}
          </Section>
          <Section title="201 documents">
            <ul className="flex flex-col gap-2 text-sm">
              {DOCS.map((d, i) => <li key={d} className="flex items-center justify-between gap-2"><span>{d}</span><Badge>{i < DOCS.length - missing ? "Complete" : "Pending"}</Badge></li>)}
            </ul>
          </Section>
        </div>
      </div>
    </>
  )
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-xl">{title}</h2>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  )
}

function Defs({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([k, val]) => <div key={k} className="min-w-0"><dt className="text-xs font-bold uppercase tracking-[0.06em] text-muted">{k}</dt><dd className="mt-0.5 break-words text-sm font-semibold">{val || "-"}</dd></div>)}
    </dl>
  )
}
