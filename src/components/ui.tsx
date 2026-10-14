import Link from "next/link"
import type { ComponentProps, CSSProperties, ReactNode } from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/lib/cn"
import type { Stat as StatData } from "@/lib/workspaces"

const BUTTON = {
  primary: "btn-primary-grad text-primary-foreground",
  outline: "border border-border-strong bg-surface text-foreground hover:border-gold hover:bg-hover hover:shadow-[var(--shadow)]",
  ghost: "text-foreground hover:bg-surface-muted",
  gold: "btn-gold-grad",
}
export type ButtonVariant = keyof typeof BUTTON

export const buttonClass = (variant: ButtonVariant = "primary", className?: string) =>
  cn("inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-bold tracking-[0.01em] active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50", BUTTON[variant], className)

export function LinkButton({ variant = "primary", className, ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />
}

// interactive: lifts with a gold edge on hover (cards that are links or open something).
export function Card({ className, interactive = false, ...props }: ComponentProps<"div"> & { interactive?: boolean }) {
  return <div className={cn("rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow)]", interactive && "card-hover", className)} {...props} />
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-gold-strong">{eyebrow}</p>}
        <h1 className="text-[28px] leading-[1.15] sm:text-[36px]">{title}</h1>
        <div className="gold-rule mt-3 w-20" aria-hidden />
        {description && <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  )
}

const GOOD = /^(Approved|Regular|Present|Inside|Healthy|Filed|Released|Complete|Closed|Resolved|Fulfilled|Yes|On track|On contract|Ready now|Low|Hired|Mandatory|Validated)$/
const WAIT = /^(Pending|Probationary|Late|Endorsed|For approval|For validation|Prepared|In progress|Investigation|Under review|Self-assessment|Manager review|Calibration|Notice to explain|Hearing|Decision|Open|Offer|Medium|Warning|Over|Ready in 1-2 years|Not yet due|Decide this month|Investigated|Incident report|CODI hearing|Exam|Interview|Screening)$/
const BAD = /^(Rejected|Absent|Outside|Overdue|High|Under|No successor|Separated|AWOL)$/
const INFO = /^(Contractual|Project-based|On leave|Elective|Applied|Rest day|Not started|No)$/

export function Badge({ children }: { children: ReactNode }) {
  const t = String(children)
  const tone = GOOD.test(t) ? "bg-success-soft text-success" : BAD.test(t) ? "bg-danger-soft text-danger" : WAIT.test(t) ? "bg-warning-soft text-warning" : INFO.test(t) ? "bg-info-soft text-info" : "bg-surface-muted text-muted"
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ring-current/15", tone)}>{children}</span>
}

export function ReleaseBadge({ release }: { release: string }) {
  const tone = release === "R1" ? "bg-navy text-gold-light" : release === "R2" ? "bg-gold-soft text-gold-strong ring-1 ring-inset ring-gold/40" : "bg-surface-muted text-muted ring-1 ring-inset ring-border-strong"
  return <span className={cn("tabular inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-extrabold tracking-wide", tone)}>{release}</span>
}

export function StatCard({ stat, icon }: { stat: StatData; icon?: ReactNode }) {
  return (
    <Card interactive className="relative overflow-hidden p-5 sm:p-6" style={{ "--tone": `var(--tone-${stat.tone})`, background: "linear-gradient(150deg, color-mix(in srgb, var(--tone) 12%, var(--surface)) 0%, var(--surface) 70%)", borderColor: "color-mix(in srgb, var(--tone) 22%, var(--border))" } as CSSProperties}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-muted">{stat.label}</span>
        {icon && <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--tone)] text-[var(--surface)]">{icon}</span>}
      </div>
      <p className="tabular mt-3 text-[28px] font-bold leading-none tracking-[-0.02em] text-[var(--tone)] sm:text-[32px]">{stat.value}</p>
      {stat.hint && <p className="mt-2 text-xs font-semibold text-muted">{stat.hint}</p>}
    </Card>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full border border-gold/40 bg-gold-soft text-gold-strong"><Inbox className="size-6" aria-hidden /></span>
      <div><p className="font-semibold">{title}</p>{description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}</div>
    </Card>
  )
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-border-strong bg-surface px-3.5 text-base text-foreground transition-[border-color,box-shadow] placeholder:text-muted hover:border-gold/70 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)] focus:outline-none sm:text-sm"
