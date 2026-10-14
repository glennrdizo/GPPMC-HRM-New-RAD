"use client"
import { useRef } from "react"
import { Eye } from "lucide-react"
import { setViewAs } from "@/app/actions"
import { VIEW_ROLES, type ViewRole } from "@/lib/viewer-roles"

// "View as" switch: changes the demo role, which hides pay and narrows records to that role's scope.
export function ViewAs({ role, dark = false }: { role: ViewRole; dark?: boolean }) {
  const form = useRef<HTMLFormElement>(null)
  return (
    <form ref={form} action={setViewAs} className="flex items-center gap-2">
      <label htmlFor={dark ? "view-as-rail" : "view-as"} className={dark ? "sr-only" : "hidden text-xs font-bold uppercase tracking-[0.12em] text-muted xl:inline"}>
        <Eye className="mr-1 inline size-3.5" aria-hidden />View as
      </label>
      <select id={dark ? "view-as-rail" : "view-as"} name="role" defaultValue={role} onChange={() => form.current?.requestSubmit()}
        className={dark
          ? "min-h-11 w-full rounded-xl border border-gold/35 bg-white/5 px-3 text-sm font-semibold text-white hover:border-gold [&>option]:text-foreground"
          : "min-h-11 rounded-xl border border-border-strong bg-surface px-3 text-sm font-semibold text-foreground hover:border-gold"}>
        {VIEW_ROLES.map((r) => <option key={r.code} value={r.code}>{dark ? `View as: ${r.label}` : r.label}</option>)}
      </select>
      <noscript><button className="min-h-11 rounded-xl border px-3 text-sm">Apply</button></noscript>
    </form>
  )
}
